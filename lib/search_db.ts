import { Document } from 'mongodb';
import { ParsedUrlQuery } from 'querystring';
import clientPromise from '../lib/mongodb';

function str_param(
    x: string | string[] | undefined, 
    defVal: string
  ): string {

  if (x === undefined) return defVal
  else if (Array.isArray(x)) return x[0];
  else return x;
}

export default async function search_db(query: ParsedUrlQuery) {
  
  try {
    const client = await clientPromise
    const db = client.db("multimoco")

    let results;
    let searchType = str_param(query.searchType, "asr");
    let searchCollection = str_param(query.searchCollection, "legvid");
    let gestures = str_param(query.gestureSelect, "");
    let speaker = str_param(query.gestureSpeaker, "any");
    let queryText = str_param(query.query, "");
    console.log(query)

    if (((queryText === "") || (queryText === undefined))) {
      return {
        props: {
          searchResults: JSON.stringify(null),
          searchType: null,
          searchCollection: null,
          gestureSelect: null,
          gestureSpeaker: null,
        }
      }
    }

    const aggregationPipeline: Document[] = [
      { "$match": { "payload.text": new RegExp(queryText, "i") } },
      {
        "$sort": {
          "name": 1,
          "offset": 1
        }
      },
      // group results by video name
      // {
      //   "$group": {
      //     "_id": "$name",
      //     "groupResults": {
      //       "$push": "$$ROOT",
      //     },
      //   }
      // },
      {
        "$lookup": {
          "from": "videos_meta",
          "localField": "name",
          "foreignField": "name",
          "as": "video_meta",
        }
      },
    ]

    if ((gestures !== "")) {
      console.log("Gestures")
      console.log(gestures)
      let gestureSearch: string[] = []
      if (speaker === 'any') {
        gestures.split(',').forEach((ges) => {
          gestureSearch.push(`SP1_${ges}`);
          gestureSearch.push(`SP2_${ges}`);
        })
      } else if (speaker === 'SP1') {
        gestures.split(',').forEach((ges) => {
          gestureSearch.push(`SP1_${ges}`);
        })
      } else if (speaker === 'SP2') {
        gestures.split(',').forEach((ges) => {
          gestureSearch.push(`SP2_${ges}`);
        })
      }
      console.log(gestureSearch)
      aggregationPipeline.splice(1, 0, { "$match": { "payload.cosp": { $in: gestureSearch } } })
    }

    console.log(aggregationPipeline);

    if (searchType === "asr") {
      results = await db.collection("aligned_utt").aggregate(aggregationPipeline).toArray()

    } else if (searchType === "ocr") {
      results = await db.collection("ocr_blocks").aggregate(aggregationPipeline).toArray()
    }

    // filter results by collection
    if (searchCollection !== 'all') {
      results = results?.filter((doc) => doc.video_meta[0].payload.video_type === searchCollection);
    }

    // console.log(results?.slice(0, 3))

    results?.forEach(function (part, index, theArray) {
      theArray[index].text = theArray[index].payload.text;
      theArray[index].cosp = theArray[index].payload.cosp
      theArray[index].blankIntervals = theArray[index].payload.blank_intervals

      // move payload to first level
      for (const [key, value] of Object.entries(theArray[index].video_meta[0].payload)) {
        theArray[index][key] = value;
      }

      if (theArray[index].hasOwnProperty("meeting_date")) {
        theArray[index].datetime = theArray[index].meeting_date
      }

      theArray[index].datetime = theArray[index].datetime.toDateString();
      if (theArray[index].payload.hasOwnProperty('box')) {
        theArray[index]['ocrBBox'] = theArray[index].payload.box.coordinates[0];
      }

      // include field for user annotations
      theArray[index].annotation = "";
      delete theArray[index].phones;
      delete theArray[index].payload;
      delete theArray[index]._id;
      delete theArray[index].video_meta;
    })

    console.log(results?.slice(-5));
    console.log("Hit records: ", results?.length);

    return {
      props: {
        searchResults: JSON.stringify(results),
        searchType,
        searchCollection,
        gestureSpeaker: speaker,
        gestureSelect: gestures,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: {
        searchResults: JSON.stringify(null),
        searchType: null,
        searchCollection: null,
        gestureSelect: null,
        gestureSpeaker: null,
      }
    }
  }
}
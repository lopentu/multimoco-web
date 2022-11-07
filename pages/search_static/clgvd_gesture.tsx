import SearchPage, { SearchPageProps } from "../../components/search-page";
import search_db from "../../lib/search_db";

export async function getStaticProps() {    
  return search_db({
    query: "但", 
    searchType: "asr",
    searchCollection: "legvid",
    gestureSelect: "LEFT_PALM_MEDIAL,RIGHT_PALM_MEDIAL"
  });
}

export default function SearchStatic(props:SearchPageProps) {
  return SearchPage(props);
}

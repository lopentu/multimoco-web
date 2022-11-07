import SearchPage, { SearchPageProps } from "../../components/search-page";
import search_db from "../../lib/search_db";

export async function getStaticProps() {    
  return search_db({
    query: "總統", 
    searchType: "asr",
    searchCollection: "news"
  });
}

export default function SearchStatic(props:SearchPageProps) {
  return SearchPage(props);
}

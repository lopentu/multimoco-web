import { NextPageContext } from "next";
import SearchPage, { SearchPageProps } from "../components/search-page";
import search_db from "../lib/search_db";


export async function getServerSideProps(context: NextPageContext) {    
  return search_db(context.query);
}

export default function SearchServerSide(props:SearchPageProps) {
  return SearchPage(props);
}

import Pagination from "./issues/_components/Pagination";

export default function Home() {
  return <Pagination currentPage={4} pageSize={10} itemsCount={100} />;
}

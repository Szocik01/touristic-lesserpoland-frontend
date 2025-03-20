import { SearchRounded } from "@mui/icons-material";
import PageHeader from "../components/shared/PageHeader";
import CompleteTripsList from "../components/shared/CompleteTripsList";
import { useAppSelector } from "../redux/store";

const Search = () => {
  const token = useAppSelector((state) => state.authState.token);

  return (
    <div className="container">
      <PageHeader icon={<SearchRounded />} title="Wyszukaj wycieczkę" />
      <CompleteTripsList
        getTripsRequestUrl="/search-trips"
        getTripsRequestInit={
          token
            ? {
                headers: {
                  Authorization: token,
                },
              }
            : {}
        }
      />
    </div>
  );
};

export default Search;

import { Favorite, Person } from "@mui/icons-material";
import PageHeader from "../components/shared/PageHeader";
import CompleteTripsList from "../components/shared/CompleteTripsList";
import { useAppSelector } from "../redux/store";

const UserTrips = () => {
  const token = useAppSelector((state) => state.authState.token);

  return (
    <div className="container">
      <PageHeader icon={<Favorite />} title="Moje ulubione" />
      <CompleteTripsList
        getTripsRequestUrl="/get-users-favourite"
        getTripsRequestInit={{
          headers: {
            Authorization: token,
          },
        }}
      />
    </div>
  );
};

export default UserTrips;

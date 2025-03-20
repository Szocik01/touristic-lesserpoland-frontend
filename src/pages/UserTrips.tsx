import { Person } from "@mui/icons-material";
import PageHeader from "../components/shared/PageHeader";
import CompleteTripsList from "../components/shared/CompleteTripsList";
import { useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";
import useHttp from "../hooks/useHttp";
import { API_CALL_URL_BASE } from "../utils/constants";

const UserTrips = () => {
  const token = useAppSelector((state) => state.authState.token);

  const navigate = useNavigate();

  const [sendDeleteRequest] = useHttp(`${API_CALL_URL_BASE}/delete-trip`, false);

  function handleDeleteResponse(response: Response) {
    if (!response.ok) {
      throw new Error("Nie udało się usunąć wycieczki");
    }
    return response.json().then(() => {
      window.location.reload();
    });
  }

  function handleDeleteError(error: Error) {
    console.error(error);
  }

  return (
    <div className="container">
      <PageHeader icon={<Person />} title="Moje wycieczki" />
      <CompleteTripsList
        onEditModeButtonClick={(tripId) => {
          navigate(`/edytuj-wycieczke/${tripId}`);
        }}
        onDeleteButtonClick={(tripId) => {
          sendDeleteRequest(
            handleDeleteResponse,
            handleDeleteError,
            {
              method: "DELETE",
              headers: {
                Authorization: token,
              },
            },
            `/${tripId}`
          );
        }}
        allowOwnerActions
        getTripsRequestUrl="/get-logged-user-trips"
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

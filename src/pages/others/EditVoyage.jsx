import { useParams } from "react-router-dom";
import VoyageComponent from "../../components/voyage/VoyageComponent";
import { UseUser } from "../../contexts/UserContext";
import { useVoyages } from "../../contexts/VoyageContext";
import { useEffect, useState } from "react";

function EditVoyage() {
  const { id } = useParams();
  const { loadVoyageDetails } = useVoyages();
  const { user } = UseUser();
  const [voyage, setVoyage] = useState(null);

  useEffect(() => {
    // setLoading(true);
    if (user?._id && id) {
      dataAccess();
      // console.log(voyage);
      // console.log(voyageData);

      // setLoading(false);
    }
  }, [id, user]);

  const voyageData = {
    boatName: "asas",
    boatId: "67af8369dacd880d8d3212de",
    mode: "Paseo",
    skipperID: "data.skipper",
    crewMembers: [
      { _id: "677952c5e68c38fd95d41366", userName: "max" },
      { _id: "67bc7d8584d54a3bec4f9f13", userName: "lek" },
      { _id: "67a4f8491369985d36476652", userName: "fran" },
    ],
    guestCrew: [],
    crewDisplay: [
      { _id: "677952c5e68c38fd95d41366", userName: "max", type: "crew" },
      { _id: "67bc7d8584d54a3bec4f9f13", userName: "lek", type: "crew" },
      { _id: "67a4f8491369985d36476652", userName: "fran", type: "crew" },
    ],
    departure: "2025-12-31T15:22:02.110Z",
    arrival: "2026-12-31T15:22:05.598Z",
    miles: 20,
    comments: "data.fact",
    distance: 20,
    distanceUnit: "NM",
  };

  const dataAccess = async () => {
    const data = await loadVoyageDetails(id);

    const voyageData = {
      boatName: data.boatId.boatName,
      boatId: data.boatId._id,
      mode: data.mode,
      skipperID: data.skipper,
      crewMembers: data.crewMembers,
      guestCrew: data.guestCrew,
      crewDisplay: [{ userName: "titere", type: "crew" }],
      departure: data.departure,
      arrival: data.arrival,
      miles: data.miles,
      comments: data.fact,
      distance: data.miles,
      distanceUnit: "NM",
    };
    setVoyage(voyageData);
  };

  const tripu = () => {
    const latripu = voyageData.crewMembers;
    // console.log(latripu);
  };

  const { updateVoyage } = useVoyages();
  const handleUpdateVoyage = (user, data, voyageId) => {
    console.log(voyageId);

    updateVoyage(user, data, voyageId);
  };

  return (
    <VoyageComponent
      action={"edit"}
      handleData={(user, data) => handleUpdateVoyage(user, data, id)}
      preloadTripData={voyageData}
    />
  );
}

export default EditVoyage;

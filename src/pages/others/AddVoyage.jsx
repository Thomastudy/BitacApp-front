import VoyageComponent from "../../components/voyage/VoyageComponent";
import { useVoyages } from "../../contexts/VoyageContext";

function AddVoyage() {
  const { addVoyage } = useVoyages();
  const handleAddVoyage = (user, data) => {
    addVoyage(user, data);
  };

  return (
    <VoyageComponent
      action={"add"}
      handleData={(user, data) => handleAddVoyage(user, data)}
    />
  );
}

export default AddVoyage;

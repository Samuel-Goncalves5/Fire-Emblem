import Database from "./Database";
import LoadAndSave from "./LoadAndSave";
import Modif from "./Modif";
import Simulator from "./Simulator";
import { useDatabase } from "./useDatabase";

function SousMenu({id} : {id:number})
{
  const {getSelected} = useDatabase();
  
  switch (id) {
    case 1:
      return getSelected() ? <Modif /> : <Database />;
    case 2:
      return <LoadAndSave />
    case 3:
      return <Simulator />
    default:
      return null
  }
}

export default SousMenu;
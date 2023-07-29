import { useContext } from "react";
import { DatabaseContext, DatabaseContextData } from "./DatabaseContextProvider";

// Wrapper around useContext to make it easier to use
export function useDatabase(): DatabaseContextData {
    return useContext(DatabaseContext);
}
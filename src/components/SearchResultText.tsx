import { ReactElement, useCallback, useContext, useMemo} from "react"
import { DashboardContext } from "../context/DashboardContext";

export interface SearchResultTextProps {
  resultCount: number;
  handleReset: () => void;
}

const SearchResultText = ({resultCount, handleReset}: SearchResultTextProps): ReactElement => {
  const {activeSearch} = useContext(DashboardContext);
  const searchText = useMemo(() => {
    return activeSearch.split(",").map(value => value.trim()).map(v => `"${v}"`).join(" and ");
  }, [activeSearch]);

  return (
    <div className="pb-4"> 
      <span className="text-orange-800">Showing {resultCount} results for {searchText} </span>
      <button onClick={handleReset} className="link">Clear results</button>
    </div>
  );
};

export {SearchResultText};

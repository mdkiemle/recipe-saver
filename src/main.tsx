/**
 * The main entry point for the react app. Routes and such should probably go here
 */
import {ReactElement, useState} from "react";
import {Route, Routes} from "react-router-dom";
import {DashboardPage} from "./views/dashboard";
import {RecipePage} from "./views/recipe";
import { DashboardContextProvider } from "./context/DashboardContext";
import { FolderContextProvider } from "./context/FolderContext";
import { RecipeContextLayout } from "./RecipeContextLayout";
import { PrintPage } from "./views/print";
import { ToastContainer } from "react-toastify";
import { CloseButton } from "./components/toasts/CloseButton";
import { LandingPage } from "./views/landing";
import { useMount } from "./hooks/useMount";
import { Button } from "@headlessui/react";
import { startApplication } from "./messaging/send";


/**
 * My thoughts for tomorrow:
 * We might want to have a call here to see if the user has a settings file, and if we do, we load
 * it up and continue as normal. If there isn't a settings file we want to let the user choose a file location
 * to store their recipes, and then from there we continue as normal, essentially.
 * 
 * For doing this, we might want something like condtional rendering that will only have one route if
 * we don't have a settings file. A "setup" or "landing" page, that will only allow the user to do a one time
 * setup and make their folders, etc. 
 * While we make this call, we're going to want some sort of "loading" screen that will be shown until
 * the call comes back and the database is hooked up (assuming there is one).
 * Might take some reworks but I think it makes sense.
 */

// We could potentially have DashboardContext wrap everything here, but for now it's fine. 
const Main = (): ReactElement => {
  const [loading, setLoading] = useState(true); // Start off loading so we don't have any flashing.
  const [hasDatabase, setHasDatabase] = useState(false); // Might need to figure out a better way to do this. Fine for now.
  useMount(() => {
    console.log("Main has mounted");
    startApplication().then(value => {
      if (value === "success") setHasDatabase(true);
      setLoading(false);
    });
  });

  const showDefaultLocation = (): string => {
    return "";
  };


  if (loading) return (<>
      <div className="h-full flex flex-col justify-center items-center">
        <span>LOADING</span>
        <Button className="btn-primary" onClick={() => setLoading(false)}>Test load</Button>
      </div>
    </>
  )

  // We only get here after load is complete.
  if (!hasDatabase) {
    return (
      <div>
        <h1>Hello</h1>
        <div>
          You either don&apos;t have a database setup, or the default location hasn&apos;t been set up yet.
        </div>
      </div>
    )
  }
  return (<>
    <FolderContextProvider>
      <DashboardContextProvider>
        <ToastContainer
          limit={3}
          position="top-center"
          toastClassName="bg-purple-100 fill-orange-800"
          closeButton={CloseButton}
          autoClose={2500}
          pauseOnHover={false}
        />
        <Routes>
          <Route index path="/" element={<DashboardPage />}/>
          <Route element={<RecipeContextLayout />}>
            <Route path="/recipe/:recipeId?" element={<RecipePage />} /> 
            <Route path="/print/:recipeId?" element={<PrintPage />} />
          </Route>
        </Routes>
      </DashboardContextProvider>
    </FolderContextProvider>
  </>);
};

export {Main};
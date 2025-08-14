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
import { useMount } from "./hooks/useMount";
import { Button } from "@headlessui/react";
import { createNewDatabase, loadNewDatabase, startApplication } from "./messaging/send";


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
  const [defaultLocation, setDefaultLocation] = useState("");
  useMount(() => {
    console.log("Main has mounted");
    startApplication().then(value => {
      console.log("What's the value?", value);
      if (value === "success") setHasDatabase(true);
      else {
        setDefaultLocation(value); // might not work.
      }
      setLoading(false);
    });
  });

  const handleExisting = (): void => {
    loadNewDatabase({path: defaultLocation, saveAsDefault: true}).then(res => {
      setHasDatabase(true);
    }).catch(err => {
      console.log("Well hopefully we don't get this often", err);
    }); // Open the default location if one exists!
  };

  const handleNew = (): void => {
    createNewDatabase({saveAsDefault: true}).then(res => {
      // If we make it here we should have a new database yay!
      setHasDatabase(true);
    });
  }

  if (loading) return (<>
      <div className="h-full flex flex-col justify-center items-center">
        <span>LOADING</span>
      </div>
    </>
  )

  // We only get here after load is complete.
  if (!hasDatabase) {
    return (
      <div className="flex flex-col max-w-4xl align-center m-auto text-center gap-2">
        <h1 className="self-center text-4xl text-orange-500">Setup</h1>
        <p>
          You either don&apos;t have a database setup, or the default location hasn&apos;t been set up yet.
        </p>
        <p>
          The standard default location is: <span className="text-purple-500 font-bold">{defaultLocation}</span>
        </p>
        <p>
          If you have made something in this before, you can click on &quot;Use Existing&quot; button below and select the database you want to use.
        </p>
        <p>
          If you&apos;d like to create a brand new database, you can click on &quot;Create New&quot; button below.
        </p>
        <p>
          Both of these options will set your new default path, and you shouldn&apos;t see this screen again. Hopefully.
        </p>
        <p>
          You will have the option to create or load recipe files in the main app, so this decision isn&apos;t final. :)
        </p>
        <div className="flex justify-evenly">
          <Button className="btn-primary" onClick={handleExisting}>Use Existing</Button>
          <Button className="btn-secondary" onClick={handleNew}>Create New</Button>
        </div>

        <div>
          NOTE: If you get an error after creating a brand new recipe database from this screen, you can safely ignore the errors that pop up (click the X top right). I&apos;m working on fixing that, but nothing is technically wrong. :)
        </div>
      </div>
    );
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
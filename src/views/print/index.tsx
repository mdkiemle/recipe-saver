import React, {ReactElement, useCallback, useContext, useState} from "react";
import { RecipeContext } from "../../context/RecipeContext";
import { useNavigate } from "react-router";
import { FaBoxes, FaBoxOpen, FaChevronLeft, FaColumns, FaXbox } from "react-icons/fa";
import { prettyTime } from "../../util/pretty-time";
import { PrintTwoColumnView } from "../../components/PrintTwoColumnView";
import { PrintColumnView } from "../../components/PrintColumnView";
import { PiBoundingBoxFill, PiColumns } from "react-icons/pi";
import { TbColumns1 } from "react-icons/tb";
import {BrowserWindow} from "electron";
import { Button } from "@headlessui/react";

enum PageView {
  Column,
  Columns
}

const options: Electron.WebContentsPrintOptions = {
  silent: false,
  color: false,
  printBackground: false,
  pagesPerSheet: 1,
  copies: 1,
};

const PrintPage = (): ReactElement => {
  const {recipe} = useContext(RecipeContext);
  const nav = useNavigate();
  const handleBack = () => nav(-1);
  const [currentView, setCurrentView] = useState<PageView>(PageView.Columns);

  const chooseView = (): React.ReactNode => {
    switch (currentView)
    {
      case PageView.Column:
        return <PrintColumnView recipe={recipe} />
      case PageView.Columns:
        return <PrintTwoColumnView recipe={recipe} />
      default:
        return <PrintColumnView recipe={recipe} />
    }
  }

  const changeCurrentView = (value: PageView): void => setCurrentView(value);

  const handlePrint = (): void => {
    let win = BrowserWindow.getFocusedWindow();

    win.webContents.print(options, (success, failureReason) => {
      if (!success) console.log(failureReason);
      console.log("Doing the printing");
    });
  };

  return (
    <div className="container flex flex-col">
      <nav className="container flex flex-row gap-2 pb-4">
        <FaChevronLeft className="size-5 cursor-pointer self-center" onClick={handleBack}/>
        <FaColumns className="size-5 cursor-pointer self-center" onClick={() => changeCurrentView(PageView.Columns)}/>
        <TbColumns1 className="size-5 cursor-pointer self-center" onClick={() => changeCurrentView(PageView.Column)}/>
      </nav>
      {chooseView()}
      {/* <header>
        <h2 className="text-2xl">{recipe.name}</h2>
      </header>
      <div className="flex gap-4">
        {recipe.timers.map(timer => <span key={timer.id}>{timer.name} - {timer.maxTime}</span>)}
      </div>
      {recipe.totalTime > 0 && 
        <div>
        {prettyTime(recipe.totalTime)}
        </div>
      }
      <div className="flex">
        <div className="flex-1">
          <h2 className="text-2xl">Ingredients</h2>
          {recipe.ingredientGroups.map(ig => <div key={ig.id}>
            <h3 className="text-xl">{ig.groupName}</h3>
            {ig.ingredients.map(ing => <p key={ing.id}>{ing.measurement} {ing.item}</p>)}
          </div>)}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl">Directions</h2>
          {recipe.instructions}
        </div>
      </div>
      <div>
        {recipe.notes}
      </div> */}
      <Button className="btn-primary" onClick={handlePrint}>Print</Button>
    </div>
  );
};

export {PrintPage};

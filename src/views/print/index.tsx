import React, {createRef, ReactElement, useContext, useRef, useState} from "react";
import { RecipeContext } from "../../context/RecipeContext";
import { useNavigate } from "react-router";
import {FaChevronLeft, FaColumns} from "react-icons/fa";
import { PrintTwoColumnView } from "../../components/PrintTwoColumnView";
import { PrintColumnView } from "../../components/PrintColumnView";
import { TbColumns1 } from "react-icons/tb";
import { Button } from "@headlessui/react";
import { useReactToPrint } from "react-to-print/lib";
import { printPrevew } from "../../messaging/send";

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

  const printDivRef = useRef<HTMLDivElement>(null);

  // Can use this if we find another view we want to implement.
  // const chooseView = (): React.ReactNode => {
  //   switch (currentView)
  //   {
  //     case PageView.Column:
  //       return <PrintColumnView recipe={recipe} />
  //     case PageView.Columns:
  //       return <PrintTwoColumnView recipe={recipe} />
  //     default:
  //       return <PrintColumnView recipe={recipe} />
  //   }
  // }

  const changeCurrentView = (value: PageView): void => setCurrentView(value);

  const handlePreview = (target: HTMLIFrameElement): any => {
    return new Promise(() => {
      const data = target.contentWindow.document.documentElement.outerHTML;
      const blob = new Blob([data], {type: "text/html"});
      const url = URL.createObjectURL(blob);

      printPrevew(url);
      // window.electronAPI.previewComponent(url, (response: any) => {
      //   console.log("Main: ", response);
      // });
      
    });
  };

  const printFunction = useReactToPrint({
    contentRef: printDivRef,
    documentTitle: "Testing",
    print: handlePreview,
  });

  return (
    <div className="container flex flex-col">
      <nav className="container flex flex-row gap-2 pb-4">
        <FaChevronLeft className="size-5 cursor-pointer self-center" onClick={handleBack}/>
        <FaColumns className="size-5 cursor-pointer self-center" onClick={() => changeCurrentView(PageView.Columns)}/>
        <TbColumns1 className="size-5 cursor-pointer self-center" onClick={() => changeCurrentView(PageView.Column)}/>
      </nav>
      <div className="container" ref={printDivRef}>
        {/* {chooseView()}  We can use this if we get more than two views.*/}
        {currentView == PageView.Column ? <PrintColumnView recipe={recipe} /> : <PrintTwoColumnView recipe={recipe} /> }
      </div>
      <Button className="btn-primary" onClick={printFunction}>Print</Button>
    </div>
  );
};

export {PrintPage};

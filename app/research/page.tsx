"use client";

import {PrimaryColorActionButton} from "@/components/reusables/buttons";
import { PrimaryTextArea, PrimaryTextInput } from "@/components/reusables/form-inputs";
import BackToDashboardComponent from "@/components/reusables/go-back-to-dashboard-button";
import ToggleOptionButtonComponent from "@/components/reusables/toggle-options-button";
import ToggleSwitchComponent from "@/components/reusables/toggle-switch";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
export default function RunResearchPagePage() {

    // the state variables
    // States of custom form elements values
    const [researchFocus, setResearchFocus] = useState("specific-influencer");
    const [timeRange, setTimeRange] = useState("last-week");
    const [selectedScientificJournalsList, setSelectedScientificJournalsList] = useState([] as string[]);

    // Display status message states
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // States of custom form elements display logic
    const [verifyWithScientificJournalsIsOn, setVerifyWithScientificJournalsIsOn] = useState(false);
    const [scientificJournalOptionsList, setScientificJournalOptionsList] = useState([
        "PublicMed Central", "Nature", "Science", "Cell", "The Lancet", "New England Journal of Medicine", "JAMA Network"
    ]);
    const [newJournal, setNewJournal] = useState("");
    const [newJournalIsOpen, setNewJournalIsOpen] = useState(false);

    const onResearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // get the data from the form 
        const form = e.currentTarget;
        const formData = new FormData(form);
        // add the dynamic form values to the form data
        formData.append("research-focus", researchFocus);
        formData.append("time-range", timeRange);
        formData.append("verify-with-scientific-journals", selectedScientificJournalsList.join(", "));

        // print the form values to an array
        console.log(Object.fromEntries(formData.entries()));

    };

    const addOrRemoveSelectedJournal = (journal: string) => {
        if (selectedScientificJournalsList.includes(journal)) {
            setSelectedScientificJournalsList(selectedScientificJournalsList.filter(journalName => journalName !== journal));
        } else {
            setSelectedScientificJournalsList([...selectedScientificJournalsList, journal]);
        };
        
    };

    // add a new journal if it doesn't exist in the list
    const addNewJournalOption = (newJournal: string) => {
        
        if (!scientificJournalOptionsList.includes(newJournal)) {
            setScientificJournalOptionsList([...scientificJournalOptionsList, newJournal]);
            setNewJournal("");
            setNewJournalIsOpen(false);
        } else {
            setErrorMessage("Journal already exists");
        }
    }
    
    // automatically hide error and success messages after 5 seconds
    useEffect(() => {
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 5000);
    }, [errorMessage]);
                        

    return (
    <main id="research-page" className="p-4 min-h-screen max-w-4xl mx-auto flex flex-col gap-2">
        <h1 hidden>
            Research Task
        </h1>

        <section id="title-section">
            <BackToDashboardComponent />
            <span className="text-2xl font-bold ml-2">
                Research Task
            </span>
        </section>

        <section id="research-tasks-section" className="flex flex-col gap-3">
            {successMessage && (
                <div className="p-4 bg-emerald-200 text-emerald-700 rounded-md">{successMessage}</div>
            )}
            {!successMessage && errorMessage && (
                <div className="p-4 bg-red-200 text-red-700 rounded-md">{errorMessage}</div>
            )}
        </section>

        <section id="research-tasks-section" className="bg-slate-800 p-4 rounded-md border-2 border-white">
            <h2 className="text-xl font-bold text-white mb-4">
                <FontAwesomeIcon icon={faGear} className="mr-2 text-emerald-500 text-base" />
                Research Configuration
            </h2>
            <form action="/research" method="GET" onSubmit={onResearchFormSubmit} className="flex flex-row flex-wrap">
                <div className="form-group flex flex-row gap-4 items-start justify-between flex-wrap w-full p-4">
                    <ToggleOptionButtonComponent title="Specific Influencer" subTitle="Research a known health insurance by name" currentStateOptions={researchFocus} onClickSelectionAction={setResearchFocus} selectionButtonOption="specific-influencer" />
                    <ToggleOptionButtonComponent title="New Influencer" subTitle="Research a known health insurance by name" currentStateOptions={researchFocus} onClickSelectionAction={setResearchFocus} selectionButtonOption="new-influencer" />
                </div>
                <div className="form-group flex flex-row gap-4 flex-wrap w-full p-4">
                    <label htmlFor="time-range" className="w-full">Time Range</label>

                    <ToggleOptionButtonComponent title="Last Week" currentStateOptions={timeRange} onClickSelectionAction={setTimeRange} selectionButtonOption="last-week" />
                    <ToggleOptionButtonComponent title="Last Month" currentStateOptions={timeRange} onClickSelectionAction={setTimeRange} selectionButtonOption="last-month" />
                    <ToggleOptionButtonComponent title="Last Year" currentStateOptions={timeRange} onClickSelectionAction={setTimeRange} selectionButtonOption="last-year" />
                    <ToggleOptionButtonComponent title="All Time" currentStateOptions={timeRange} onClickSelectionAction={setTimeRange} selectionButtonOption="all-time" />
                </div>
                <div className="form-group w-1/2 p-4 flex items-stretch flex-col gap-2 items-center">
                    <label htmlFor="influencer-name">Influencer Name</label>
                    <input type="text" id="influencer-name" name="influencer-name" className="bg-gray-600 rounded-md px-2 py-1 text-gray-100 focus:bg-gray-700"/>
                </div> 
                <div className="form-group w-1/2 p-4">
                    <ToggleSwitchComponent label={"Verify with Scientific Journals"} isOn={verifyWithScientificJournalsIsOn} setIsOn={setVerifyWithScientificJournalsIsOn} />
                </div>
                <div className="form-group w-1/2 p-4 flex items-stretch flex-col gap-2 items-center">
                    <label htmlFor="claims-to-analyze">Claims to Analyze Per Influencer</label>
                    <input type="number" id="claims" name="claims" className="bg-gray-600 rounded-md px-2 py-1 text-gray-100 focus:bg-gray-700"/>
                </div>
                
                <div className="form-group flex flex-row justify-between content-start flex-wrap w-full p-4 gap-2">
                    {/* This specify the list of journals */}
                    <span className="w-full my-2">Scientific Journals</span>
                    {scientificJournalOptionsList.map(journal => {
                        return (
                                <ToggleOptionButtonComponent title={journal} currentStateOptions={selectedScientificJournalsList} onClickSelectionAction={addOrRemoveSelectedJournal} selectionButtonOption={journal} key={journal} className="w-2/5 grow-0"/> // grow-0 is a custom class to prevent the button from growing, because it comes after the already in flex-grow-1 style
                        );
                    })}

                    {/* Add new journal btn */}
                    <div className="w-full">
                        <button className="text-emerald-500 p-2 hover:text-emerald-600 text-lg" type="button" onClick={() => setNewJournalIsOpen(!newJournalIsOpen)}
                        >Add New Journal</button>
                    </div>
                </div>
                <div className={`form-group w-full p-4 flex-row gap-2 items-center ${newJournalIsOpen ? "flex" : "hidden"}`}>
                    <span>New Journal:</span>
                    <PrimaryTextInput value={newJournal} onChange={(e) => setNewJournal(e.target.value)} placeholder="Enter the name of the new journal" name=""/>
                    <PrimaryColorActionButton title="Add" action={() => addNewJournalOption(newJournal)} disabled={newJournal.trim() === ""}/>
                </div>
                <div className="form-group p-4 flex items-stretch flex-col gap-2 items-center w-full">
                    <label htmlFor="notes-to-assistant" className="w-full">Notes for the Research Assistant</label>
                    <PrimaryTextArea placeholder="Enter notes for the research assistant" name="notes-to-assistant" rowSize={5} className="w-full"/>
                </div>
                <div className="form-group w-full p-4 flex flex-row justify-end">
                    <PrimaryColorActionButton title="Start Research" action={() => {console.log("submit button")}} buttonType="submit" className="self-end"/>
                </div>
            </form>
        </section>
    </main>);
}
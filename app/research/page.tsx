"use client";

import ToggleSwitchComponent from "@/components/reusables/toggle-switch";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function RunResearchPagePage() {

    // the state variables
    // States of custom form elements values
    const [researchFocus, setResearchFocus] = useState("specific-influencer");
    const [timeRange, setTimeRange] = useState("last-30-days");
    const [selectedScientificJournalsList, setSelectedScientificJournalsList] = useState([] as Array<string>);

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
                        

    return (<main>
        <Link href="/" >
            Go Back to Dashboard
        </Link>
        <h1>Research Task</h1>

        <section id="research-tasks-section">
            {successMessage && <div className="text-emerald-500">{successMessage}</div>}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </section>

        <section id="research-tasks-section">
            <form action="/research" method="GET" onSubmit={onResearchFormSubmit}>
                <div className="form-group">
                    <button type="button" id="research-focus-specific-influencer" 
                    onClick={() => setResearchFocus("specific-influencer")}>
                        Specific Influencer
                    </button>
                    <button type="button" id="research-focus-new-influencer"
                    onClick={() => setResearchFocus("new-influencer")}>
                        New Influencer
                    </button>
                </div>
                <div className="form-group">
                    <label htmlFor="time-range">Time Range</label>

                    <input type="button" id="time-range-last-week" value="Last Week" name="time-range" onClick={() => setTimeRange("last-week")}/>
                    <input type="button" id="time-range-last-month" value="Last Month" name="time-range" onClick={() => setTimeRange("last-month")}/>
                    <input type="button" id="time-range-last-year" value="Last Year" name="time-range" onClick={() => setTimeRange("last-year")}/>
                    <input type="button" id="time-range-all-time" value="All Time" name="time-range" onClick={() => setTimeRange("all-time")}/>
                </div>
                <div className="form-group">
                    <label htmlFor="influencer-name">Influencer Name</label>
                    <input type="text" id="influencer-name" name="influencer-name" />
                </div>
                <div className="form-group">
                    <label htmlFor="claims-to-analyze">Claims to Analyze Per Influencer</label>
                    <input type="number" id="claims" name="claims" />
                </div>
                <div className="form-group">
                    <ToggleSwitchComponent label={"Verify with Scientific Journals"} isOn={verifyWithScientificJournalsIsOn} setIsOn={setVerifyWithScientificJournalsIsOn} />
                </div>
                <div className="form-group flex flex-row items-start justify-between flex-wrap">
                    {/* This specify the list of journals */}
                    <span className="w-full">Scientific Journals</span>
                    {scientificJournalOptionsList.map(journal => {
                        return <button className={`w-96`}  type="button" value={journal} onClick={() => addOrRemoveSelectedJournal(journal)} key={journal}>{journal}</button>
                    })}

                    {/* Add new journal btn */}
                    <div className="w-full">
                        <button className="" type="button" onClick={() => setNewJournalIsOpen(!newJournalIsOpen)}>Add New Journal</button>
                    </div>
                </div>
                <div className="form-group" style={{display: newJournalIsOpen ? "block" : "none"}}>
                    <label htmlFor="new-journal">New Journal</label>
                    <input type="text" value={newJournal} onChange={(e) => setNewJournal(e.target.value)}/>
                    <button type="button" onClick={() => addNewJournalOption(newJournal)}>Add</button>
                </div>
                <div className="form-group">
                    <label htmlFor="notes-to-assistant" className="w-full">Notes for the Research Assistant</label>
                    <textarea id="notes-to-assistant" name="notes-to-assistant" className="w-full" rows={5}/>
                </div>
                <button type="submit">Start Research</button>
            </form>
        </section>
    </main>);
}
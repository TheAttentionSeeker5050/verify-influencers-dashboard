"use client";

import {PrimaryColorActionButton} from "@/components/reusables/buttons";
import { PrimaryTextArea, PrimaryTextInput } from "@/components/reusables/form-inputs";
import BackToDashboardComponent from "@/components/reusables/go-back-to-dashboard-button";
import ResearchProgressModalComponent from "@/components/reusables/modal-research-progress";
import { AppStatusMessagesComponent } from "@/components/reusables/status-messages";
import ToggleOptionButtonComponent from "@/components/reusables/toggle-options-button";
import ToggleSwitchComponent from "@/components/reusables/toggle-switch";
import { formatTwitterHandle } from "@/utils/string-formatters";
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

    const [messageResearchStatus, setMessageResearchStatus] = useState("" as string);
    const [researchProgressModalIsOpen, setResearchProgressModalIsOpen] = useState(false);

    // States of custom form elements display logic
    const [verifyWithScientificJournalsIsOn, setVerifyWithScientificJournalsIsOn] = useState(false);
    const [scientificJournalOptionsList, setScientificJournalOptionsList] = useState([
        "PublicMed Central", "Nature", "Science", "Cell", "The Lancet", "New England Journal of Medicine", "JAMA Network"
    ]);
    const [newJournal, setNewJournal] = useState("");
    const [newJournalIsOpen, setNewJournalIsOpen] = useState(false);
    
    const [influencerAutofillName, setInfluencerAutofillName] = useState("");
    const [influencerTwitterHandle, setInfluencerTwitterHandle] = useState("");

    const [influencerAutofillList, setInfluencerAutofillList] = useState([]);

    const [formData, setFormData] = useState(new FormData());

    const populateAutofillList = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        setInfluencerAutofillName(e.target.value);

        if (e.target.value === "") {
            setInfluencerAutofillList([]);
            return;
        }
        // asyncronously fetch the list of influencers from the backend
        fetch(`http://localhost:3000/api/influencers/autocomplete-influencer-name?q=${e.target.value}`)
        .then(response => response.json())
        .then(data => {
            setInfluencerAutofillList(Array.from(data.data) ?? []);
        })
        .catch(error => console.error("Error fetching autofill list", error));
    };


    function executeFetchRequest(
        fetchRequest: () => Promise<Response>,
        nextStatus: string
    ): Promise<Response> {
        return fetchRequest()
        .then((response) => {
            if (!response.ok) {
                console.error("Error running research", response);
                throw new Error("Error running research");
            }
            return response.json();
        }).then((data) => {
            console.log(data);
            setMessageResearchStatus(nextStatus);
            return data;
        }).catch((error) => {
            setMessageResearchStatus("");
            setResearchProgressModalIsOpen(false);
            console.error("Error running research", error);
            return error;
        });
    }

    const onResearchFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setResearchProgressModalIsOpen(true);

        // get the data from the form 
        const form = e.currentTarget;
        const newFormData = new FormData(form);
        // add the dynamic form values to the form data
        formData.append("research-focus", researchFocus);
        formData.append("time-range", timeRange);
        formData.append("verify-with-scientific-journals", selectedScientificJournalsList.join(", "));

        setFormData(newFormData);

        try {
            setMessageResearchStatus("FETCHING_TWEETS");
            const fetchTweetsFromApiRequest = fetch("http://localhost:3000/api/run-research/populate-new-tweets", {
                method: "POST",
                body: formData,
                headers: {
                    contentType: "application/json"
                }
            });

            executeFetchRequest(() => fetchTweetsFromApiRequest, "RESEARCHING");
        } catch (error) {
            // console.error("Error sending form data", error);
            setErrorMessage("Error running research");
        } 
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

    }, [errorMessage, successMessage]);

    useEffect(() => {
        // if not open, dont do any request
        if (researchProgressModalIsOpen === false) {
            setMessageResearchStatus("");
            return;
        };

        if (messageResearchStatus === "RESEARCHING") {
            console.log("Researching...");
            console.log("Form data", formData);
            const verifyClaimsRequest = fetch("http://localhost:3000/api/run-research", {
                method: "POST",
                body: formData,
                headers: {
                    contentType: "application/json"
                }
            });

            executeFetchRequest(() => verifyClaimsRequest, "DONE");
        } else if (messageResearchStatus === "DONE") {
            setTimeout(() => {
                setResearchProgressModalIsOpen(false);
            })
        }

    }, [messageResearchStatus]);

    // Handle select the dropdown option
    function handleDropdownOptionClick(e: React.MouseEvent<HTMLButtonElement>, newTwitterHandle: string) {
        // set the state twitter handle to the selected influencer 
        setInfluencerTwitterHandle(newTwitterHandle);

        // empty influencer autofill list and input value
        setInfluencerAutofillList([]);
        setInfluencerAutofillName("");

        // set the influencer name to the selected influencer name
        setInfluencerTwitterHandle(newTwitterHandle);
    }

    return (
    <main id="research-page" className="p-4 min-h-screen h-full max-w-4xl mx-auto flex flex-col gap-2">
        {/* {messageResearchStatus !== "CLOSE" && */}
            <ResearchProgressModalComponent researchProgressModalIsOpen={researchProgressModalIsOpen} messageResearchStatus={messageResearchStatus} setResearchProgressModalIsOpen={setResearchProgressModalIsOpen} />
        {/* } */}

        <h1 hidden>
            Research Task
        </h1>

        <section id="title-section">
            <BackToDashboardComponent />
            <span className="text-2xl font-bold ml-2">
                Research Task
            </span>
        </section>
        {successMessage || errorMessage &&
            <AppStatusMessagesComponent successMessage={successMessage} errorMessage={errorMessage}/>
        }

        <section id="research-tasks-section" className="bg-slate-800 p-4 rounded-md border-2 border-white">
            <h2 className="text-xl font-bold text-white mb-4">
                <FontAwesomeIcon icon={faGear} className="mr-2 text-emerald-500 text-base" />
                Research Configuration
            </h2>
            <form onSubmit={onResearchFormSubmit} className="flex flex-row flex-wrap">
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
                <div className="form-group w-1/2 p-4 flex items-stretch flex-col items-center">
                    <label htmlFor="influencer-name" className="py-2">Influencer Name</label>
                    <input type="text" id="influencer-name" name="influencer-name" className="bg-gray-600 rounded-md px-2 py-1 mb-1 text-gray-100 focus:bg-gray-700" value={influencerAutofillName} onChange={populateAutofillList}
                    />
                    <input type="hidden" name="influencer-id" value={influencerTwitterHandle} />
                    <span className="text-gray-400 text-md">{influencerTwitterHandle}</span>
                    {/* use a dropdown menu of buttons that will be relative positioned to the influencer name */}
                    <ul className="relative top-0 left-0 w-full rounded-md">
                        {
                            // TODO: Specify the type of the influencer object
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            influencerAutofillList.map((influencer: any) => {
                                return (
                                    <li key={influencer.id} className="p-2 hover:bg-teal-900 border-2 border-white cursor-pointer">
                                        <button type="button" onClick={(e) => handleDropdownOptionClick(e, influencer.twitterHandle)} className="w-full">
                                            {influencer.name} | {formatTwitterHandle(influencer.twitterHandle)}
                                        </button>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div> 
                <div className="form-group w-1/2 p-4">
                    <ToggleSwitchComponent label={"Verify with Scientific Journals"} isOn={verifyWithScientificJournalsIsOn} setIsOn={setVerifyWithScientificJournalsIsOn} />
                </div>
                <div className="form-group w-1/2 p-4 flex items-stretch flex-col gap-2 items-center">
                    <label htmlFor="claims-to-analyze">Claims to Analyze Per Influencer</label>
                    <input type="number" id="claims" name="claims" className="bg-gray-600 rounded-md px-2 py-1 text-gray-100 focus:bg-gray-700" defaultValue={1}/>
                </div>
                {verifyWithScientificJournalsIsOn &&
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
                }
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
                    <PrimaryColorActionButton title="Start Research" buttonType="submit" className="self-end"/>
                </div>
            </form>
        </section>
    </main>);
}
import React, { Component } from 'react';
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
import {Button} from 'primereact/components/button/Button';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Growl} from 'primereact/components/growl/Growl';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {Panel} from 'primereact/components/panel/Panel';
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import {Checkbox} from 'primereact/components/checkbox/Checkbox';

import EditForm from './editForm';
var download = require("downloadjs");
var types = [{label: "text", value: "text"}, {label: "checkbox", value: "checkbox"}, {label:"radiobutton", value:"radiobutton"}, {label:"boolean", value:"boolean"},
    {label:"booleanbuttons", value:"booleanbuttons"},
    {label:"name", value:"name"}, {label:"date",value:"date"}];

export class DataTableColResizeDemo extends Component {

    componentDidMount() {
        //data => this.setState({cars1: data});
        //this.setState({"questions":this.state.questions});

    }


    /**
     * Displays the selected row's data in the footer of the table
     * @param data
     * @returns {*}
     */
    displaySelection(data) {
        if(!data || data.length === 0) {
            this.setState();
            return <div style={{textAlign: 'left'}}>No Selection</div>;
        }
        else {
            if(data instanceof Array)
                return <ul style={{textAlign: 'left', margin: 0}}>{data.map((car,i) => <li key={car.vin}>{car.vin + ' - ' + car.year + ' - ' + car.brand + ' - ' + car.color}</li>)}</ul>;
            else
                return <div style={{textAlign: 'left'}}>Selected Question: {data.id+' '+data.title}</div>
        }
    }

    /**
     * used by the cell editing process to put the updated values back in the state
     * @param props
     * @param value
     */
    onEditorValueChange(props, value) {
        let updatedQs = [...this.state.questions];
        updatedQs[props.rowIndex][props.field] = value;

        this.setState({questions: updatedQs});
    }

    /**
     * creates an edit field for a selected cell in the table
     * @param props
     * @returns {*}
     */
    inputTextEditor(props) {
        return <InputText type="text" value={this.state.questions[props.rowIndex]['id']} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }

    /**
     * creates an edit field for the title of the question when it is selected
     * @param props
     * @returns {*}
     */
    descEditor(props) {
        /*console.log(this.state);
        return this.inputTextEditor(props);*/
        return <InputText type="text" value={this.state.questions[props.rowIndex]['title']} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }

    /**
     * It seems unlikely that this page would ever be allowed to update all apps for all incoming passengers to Australia
     */
    saveAndPublish() {
        this.growl.show({ severity: 'success', summary: 'Success Message', detail: 'Your changes have been saved and are now LIVE all over the world' });
    }

    selectChange(e) {
        this.setState({selectedQ1: e.data});
        this.setState({visible: true});
    }

    onRowEdit(e) {
        console.log(e);
    }
    onHide(event) {
        this.setState({visible: false});
    }

    updateProperty(property, value) {
        let selected = this.state.selectedQ1;
        selected[property] = value;
        this.setState({selectedQ1: selected});
    }


    /**
     * called by the react framework, builds the component which edits the questions.
     * @returns {*}
     */
    render() {
        const selected = this.state.selectedQ1;
        var footer = <div>
            <Button label="Save" icon="fa-save" />
            <Button label="Cancel" icon="fa-close" />
            <Button label="Delete" icon="fa-delete" />
        </div>;

        return (

            <div>
                <Growl ref={(el) => { this.growl = el; }}></Growl>
                <h3>IPC Questions</h3>
                <div>
                Version <InputText value={this.state.version} onChange={(e) => this.setState({version: e.target.value})}/>
                </div>

                <DataTable value={this.state.questions} resizableColumns={true} scrollable={true} scrollHeight="300px"
                           footer={this.displaySelection(this.state.selectedQ1)}
                           editable={true}
                 selectionMode="single" selection={this.state.selectedQ1} onSelectionChange={(e) => this.selectChange(e)}>
                    <Column field="id" header="Id" style={{width:'10%'}} sortable={false}/>
                    <Column field="pageId" header="Page ID" style={{width:'10%'}} sortable={false}/>
                    <Column field="title" header="Question text" style={{width:'70%'}} sortable={false} editor={(p) =>this.descEditor(p)}/>
                    <Column field="questionType" header="Type" style={{width:'20%'}}/>
                    <Column field="options" header="Options" style={{width:'20%'}}/>
                </DataTable>
                <div class="ui-g">
                    <div class="ui-g-3"><Button label="Save and Publish" onClick={() =>this.saveAndPublish()} /></div>
                    <div class="ui-g-3"><Button label="Save a Copy"  onClick={()=>this.saveACopy()} /></div>
                    <div class="ui-g-3"><Button label={"Upload a Version"} name={'uploadButton'} /></div>
                    <div class="ui-g-2"/>
                    <div class="ui-g-1"><Button label="Cancel"  /></div>
                </div>
                <div>
                    <Dialog header="Edit Question" visible={this.state.visible} width="650px"  modal={true} onHide={(e) => this.onHide(e)}
                            footer = {footer}>
                        <div>
                            <div className="content-section implementation">
                                    <div class="ui-g">
                                        <div class="ui-g-4">ID</div>
                                        <div class="ui-g-4">Page Id</div>
                                        <div class="ui-g-4">Type</div>
                                    </div>
                                    <div class="ui-g">
                                        <div class="ui-g-4"><InputText value = {this.state.selectedQ1.id} onChange={(e) => this.updateProperty('id', e.target.value)}/></div>
                                        <div class="ui-g-4"><InputText value = {this.state.selectedQ1.pageId } onChange={(e) => this.updateProperty('pageId', e.target.value)}/></div>
                                        <div class="ui-g-4"><Dropdown optionLabel="label"  options={types } style={{width:'150px'}} placeholder="Select a type"
                                        value={ {label:this.state.selectedQ1.questionType, value:this.state.selectedQ1.questionType}}
                                                                      onChange={(e) => this.updateProperty('questionType', e.value.value)}/></div>
                                    </div>
                                <div class="ui-g">
                                    <div class="ui-g-12">Question text</div>
                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-112"><InputText value = {this.state.selectedQ1.title}
                                                                    onChange={(e) => this.updateProperty('title', e.target.value)}
                                                                    size = {60}/>
                                    </div>

                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-4">Short title</div>
                                    <div class="ui-g-4">Order</div>
                                    <div class="ui-g-4">Clear required</div>
                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-4"><InputText value = {this.state.selectedQ1.shortTitle} onChange={(e) => this.updateProperty('shortTitle', e.target.value)}/></div>
                                    <div class="ui-g-4"><InputText value = {this.state.selectedQ1.order } onChange={(e) => this.updateProperty('order', e.target.value)}/></div>
                                    <div class="ui-g-4"><Checkbox checked = {this.state.selectedQ1.clearRequired } onChange={(e) => this.updateProperty('clearRequired', e.target.value)}/></div>
                                </div>
                            </div>
                         </div>
                    </Dialog>
                </div>

            </div>
        );
    }

    /**
     * This function is called from the Save A Copy button to save a copy of the current (modified) questions
     * to the operator's local drive.
     */
    saveACopy() {
        // clear some things not needed to be saved
        var quest = this.state;
        delete quest.selectedQ1;

        quest.questions.forEach(function(q) {delete q._$visited;});
        quest.questions.sort(function(a, b){return a.id - b.id});

       download('data:text/plain,'+encodeURIComponent(JSON.stringify(quest, null,2)),
           'questions'+this.state.version+'.json',
           'text/plain');

    }

    onBasicUpload(event) {
        this.growl.show({ severity: 'success', summary: 'Success Message', detail: 'Your file is uploaded' });
    }

    todo() {
        this.upload.processFile(files => files)
    }




constructor() {
    super();
    this.selectChange = this.selectChange.bind(this);
    /*var myRequest = new Request('questions.0.0.0.json', {mode:'no-cors' });

    var jRequest = new Request('https://dt2s7tpmzl3lr.cloudfront.net/v1/questions/', {mode:'no-cors' });
    var fetchJson = fetch(jRequest)
        .then(function(response){ return(response.json());}).catch(function(error){console.error(error);});

    fetchJson.then(data => console.log("data:",data))
        .catch(error => console.error(error));*/

    this.state = {
        selectedQ1: 0,
        "version": "1.0.0",
        "categories": [
        {
            "id": 100,
            "order": 0,
            "heading": "Who's travelling"
        },
        {
            "id": 200,
            "order": 1,
            "heading": "About your trip"
        },
        {
            "id": 300,
            "order": 2,
            "heading": "Our arrival questions"
        }
    ],
        "pages": [
        {
            "id": 101,
            "categoryId": 100,
            "order": 0,
            "heading": ""
        },
        {
            "id": 102,
            "categoryId": 100,
            "order": 1,
            "heading": "In case of an emergency, how can we contact you?"
        },
        {
            "id": 201,
            "categoryId": 200,
            "heading": "",
            "order": 0
        },
        {
            "id": 202,
            "categoryId": 200,
            "heading": "",
            "order": 1
        },
        {
            "id": 203,
            "categoryId": 200,
            "heading": "",
            "order": 2
        },
        {
            "id": 204,
            "categoryId": 200,
            "heading": "",
            "order": 3
        },
        {
            "id": 301,
            "categoryId": 300,
            "heading": "",
            "order": 1
        }
    ],
        "sections": [
        {
            "id": 0,
            "pageId": 102,
            "heading": "Your contact details in Australia",
            "order": 0
        },
        {
            "id": 1,
            "pageId": 102,
            "heading": "Emergency contact details of family or friend",
            "order": 1
        }
    ],
        "questions": [
        {
            "id": 101,
            "pageId": 201,
            "title": "Are you a passenger or a crew member?",
            "shortTitle": "",
            "order": 1,
            "clearRequired": false,
            "questionType": "radiobutton",
            "options": [
                "Passenger",
                "Crew member"
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 201,
            "pageId": 202,
            "title": "Are you an Australian citizen?",
            "shortTitle": "",
            "order": 1,
            "clearRequired": false,
            "questionType": "boolean",
            "conditions": [
                {
                    "questionId": 101,
                    "operation": "equals",
                    "value": "Passenger"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 202,
            "pageId": 202,
            "title": "Do you usually live in Australia?",
            "shortTitle": "",
            "order": 2,
            "clearRequired": false,
            "questionType": "radiobutton",
            "options": [
                "Yes",
                "No",
                "I am migrating"
            ],
            "conditions": [
                {
                    "questionId": 101,
                    "operation": "equals",
                    "value": "Passenger"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 301,
            "pageId": 101,
            "title": "What is your Family/surname?",
            "shortTitle": "Family/surname",
            "order": 1,
            "clearRequired": false,
            "questionType": "name",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                },
                {
                    "type": "name",
                    "message": "Please enter a valid name"
                }
            ]
        },
        {
            "id": 302,
            "pageId": 101,
            "title": "What are your given names?",
            "shortTitle": "Given names",
            "order": 0,
            "clearRequired": false,
            "questionType": "name",
            "placeholder": "Enter text here",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                },
                {
                    "type": "name",
                    "message": "Please enter a valid name"
                }
            ]
        },
        {
            "id": 304,
            "pageId": 101,
            "title": "What is your date of birth?",
            "shortTitle": "Date of birth",
            "order": 2,
            "clearRequired": false,
            "questionType": "date",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 305,
            "pageId": 101,
            "title": "What is your passport number?",
            "shortTitle": "Passport number",
            "order": 3,
            "clearRequired": false,
            "questionType": "text",
            "validations": [
                {
                    "type": "passportnumber",
                    "message": "Please answer this question"
                },
                {
                    "type": "name",
                    "message": "Please enter a valid name"
                }
            ]
        },
        {
            "id": 306,
            "pageId": 101,
            "title": "What passport are you travelling on?",
            "shortTitle": "Passport nationality",
            "order": 4,
            "clearRequired": false,
            "questionType": "countryselect",
            "conditions": [],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 401,
            "pageId": 203,
            "title": "Were you in Africa, South/Central America or the Caribbean in the last 6 days?",
            "shortTitle": "",
            "order": 1,
            "clearRequired": false,
            "questionType": "boolean",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 402,
            "pageId": 203,
            "title": "In which country did you spend the most time overseas?",
            "shortTitle": "",
            "order": 2,
            "clearRequired": false,
            "questionType": "countryselect",
            "conditions": [
                {
                    "questionId": 202,
                    "operation": "equals",
                    "value": "Yes"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 403,
            "pageId": 203,
            "title": "What was your main reason for being overseas?",
            "shortTitle": "",
            "order": 3,
            "clearRequired": false,
            "questionType": "dropdownlist",
            "options": [
                "Convention/conference",
                "Visiting friends or relatives",
                "Education",
                "Holiday",
                "Business",
                "Employment",
                "Exhibition",
                "Other"
            ],
            "conditions": [
                {
                    "questionId": 202,
                    "operation": "equals",
                    "value": "Yes"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 404,
            "pageId": 203,
            "title": "What is your country of residence?",
            "shortTitle": "",
            "order": 2,
            "clearRequired": false,
            "questionType": "countryselect",
            "conditions": [
                {
                    "questionId": 202,
                    "operation": "equals",
                    "value": "No"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 501,
            "pageId": 204,
            "title": "In which country did you board this flight or ship?",
            "shortTitle": "",
            "order": 1,
            "clearRequired": false,
            "questionType": "countryselect",
            "conditions": [],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 502,
            "pageId": 204,
            "title": "What was the flight number or name of ship?",
            "shortTitle": "",
            "order": 2,
            "clearRequired": false,
            "questionType": "string",
            "conditions": [],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                },
                {
                    "type": "safechars",
                    "message": "Please use valid characters"
                },
                {
                    "type": "maxlength",
                    "message": "Too many characters used",
                    "value": "100"
                }
            ]
        },
        {
            "id": 506,
            "pageId": 102,
            "sectionId": 0,
            "title": "What is your intended address in Australia?",
            "shortTitle": "Address",
            "questionType": "textarea",
            "placeholder": "Address",
            "order": 0,
            "clearRequired": false,
            "conditions": [],
            "validations": [
                {
                    "type": "ormandatoryset",
                    "message": "Please enter at least one contact detail",
                    "value": "506,701,702"
                },
                {
                    "type": "address",
                    "message": "Please enter a valid address"
                },
                {
                    "type": "maxlength",
                    "message": "Too many characters in address",
                    "value": "400"
                }
            ]
        },
        {
            "id": 507,
            "pageId": 204,
            "title": "Which state/territory do you live in?",
            "shortTitle": "State",
            "order": 4,
            "clearRequired": false,
            "questionType": "dropdownlist",
            "options": [
                "Australian Capital Territory",
                "New South Wales",
                "Northern Territory",
                "Queensland",
                "South Australia",
                "Tasmania",
                "Victoria",
                "Western Australia"
            ],
            "conditions": [
                {
                    "questionId": 202,
                    "operation": "equals",
                    "value": "Yes"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 508,
            "pageId": 204,
            "title": "What is your intended length of stay in Australia?",
            "shortTitle": "State",
            "order": 4,
            "clearRequired": false,
            "questionType": "durationpicker",
            "conditions": [
                {
                    "questionId": 202,
                    "operation": "equals",
                    "value": "No"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 509,
            "pageId": 204,
            "title": "Do you intend to live in Australia for the next 12 months?",
            "shortTitle": "",
            "order": 3,
            "questionType": "boolean",
            "clearRequired": false,
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 510,
            "pageId": 203,
            "title": "What is your main reason for travel to Australia?",
            "shortTitle": "",
            "order": 3,
            "clearRequired": false,
            "questionType": "dropdownlist",
            "options": [
                "Convention/conference",
                "Visiting friends or relatives",
                "Education",
                "Holiday",
                "Business",
                "Employment",
                "Exhibition",
                "Other"
            ],
            "conditions": [
                {
                    "questionId": 202,
                    "operation": "equals",
                    "value": "No"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 514,
            "pageId": 204,
            "title": "What is your usual occupation?",
            "shortTitle": "Occupation",
            "Order": 5,
            "clearRequired": false,
            "questionType": "string",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                },
                {
                    "type": "safechars",
                    "message": "Please use valid characters"
                },
                {
                    "type": "maxlength",
                    "message": "Too many characters used",
                    "value": "200"
                }
            ]
        },
        {
            "id": 601,
            "pageId": 301,
            "title": "Do you have tuberculosis?",
            "shortTitle": "",
            "order": 1,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "conditions": [
                {
                    "questionId": 201,
                    "operation": "equals",
                    "value": "false"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 602,
            "pageId": 301,
            "title": "Do you have any criminal conviction/s?",
            "shortTitle": "",
            "order": 2,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "conditions": [
                {
                    "questionId": 201,
                    "operation": "equals",
                    "value": "false"
                }
            ],
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 603,
            "pageId": 301,
            "title": "Goods that may be prohibited or subject to restrictions, such as medicines, steroids, illegal pornography, firearms, weapons or illicit drugs?",
            "shortTitle": "",
            "order": 3,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 604,
            "pageId": 301,
            "title": "More than 2250mL of alcoholic beverages or 25 cigarettes or 25g of tobacco products?",
            "shortTitle": "",
            "order": 4,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 605,
            "pageId": 301,
            "title": "Goods obtained overseas or purchased duty and/or tax free in Australia with a combined total price of more than AUD$900, including gifts?",
            "shortTitle": "",
            "order": 5,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 606,
            "pageId": 301,
            "title": "Goods/samples for business/commercial use?",
            "shortTitle": "",
            "order": 6,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 607,
            "pageId": 301,
            "title": "AUD$10,000 or more in Australian or foreign currency equivalent? Note: If a customs or police officer asks, you must report travellers cheques, cheques, money orders or other bearer negotiable instruments of any amount.",
            "shortTitle": "",
            "order": 7,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 608,
            "pageId": 301,
            "title": "Meat, poultry, fish, seafood, eggs, dairy, fruit, vegetables?",
            "shortTitle": "",
            "order": 8,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 609,
            "pageId": 301,
            "title": "Grains, seeds, bulbs, straw, nuts, plants, parts of plants, traditional medicines or herbs, wooden articles?",
            "shortTitle": "",
            "order": 9,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 610,
            "pageId": 301,
            "title": "Animals, parts of animals, animal products including equipment, pet food, eggs, biologicals, specimens, birds, fish, insects, shells, bee products?",
            "shortTitle": "",
            "order": 10,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 611,
            "pageId": 301,
            "title": "Soil, items with soil attached or used in freshwater areas e.g. sports/recreational equipment, shoes?",
            "shortTitle": "",
            "order": 11,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 612,
            "pageId": 301,
            "title": "Have you been in contact with farms, farm animals, wilderness areas or freshwater streams/lakes etc in the past 30 days?",
            "shortTitle": "",
            "order": 12,
            "clearRequired": true,
            "questionType": "booleanbuttons",
            "validations": [
                {
                    "type": "mandatory",
                    "message": "Please answer this question"
                }
            ]
        },
        {
            "id": 701,
            "pageId": 102,
            "sectionId": 0,
            "title": "What is your phone number?",
            "shortTitle": "Phone",
            "order": 1,
            "clearRequired": false,
            "questionType": "phone",
            "validations": [
                {
                    "type": "ormandatoryset",
                    "message": "Please enter at least one contact detail",
                    "value": "506,701,702"
                },
                {
                    "type": "phone",
                    "message": "Please enter a valid phone number"
                }
            ]
        },
        {
            "id": 702,
            "pageId": 102,
            "sectionId": 0,
            "title": "What is your email address?",
            "shortTitle": "Email",
            "order": 2,
            "clearRequired": false,
            "questionType": "email",
            "validations": [
                {
                    "type": "ormandatoryset",
                    "message": "Please enter at least one contact detail",
                    "value": "506,701,702"
                },
                {
                    "type": "email",
                    "message": "Please enter a valid email address"
                }
            ]
        },
        {
            "id": 704,
            "pageId": 102,
            "sectionId": 1,
            "title": "What is their name?",
            "shortTitle": "Name",
            "order": 4,
            "clearRequired": false,
            "questionType": "name",
            "validations": [
                {
                    "type": "ormandatoryset",
                    "message": "Please answer this question"
                },
                {
                    "type": "name",
                    "message": "Please enter a valid name"
                }
            ]
        },
        {
            "id": 705,
            "pageId": 102,
            "sectionId": 1,
            "title": "What is their phone number?",
            "shortTitle": "Phone",
            "order": 5,
            "clearRequired": false,
            "questionType": "string",
            "validations": [
                {
                    "type": "ormandatoryset",
                    "message": "Please enter at least one contact detail",
                    "value": "705,706,707"
                },
                {
                    "type": "phone",
                    "message": "Please enter a valid phone number?"
                }
            ]
        },
        {
            "id": 706,
            "pageId": 102,
            "sectionId": 1,
            "title": "What is their email address?",
            "shortTitle": "Email",
            "order": 6,
            "clearRequired": false,
            "questionType": "email",
            "validations": [
                {
                    "type": "ormandatoryset",
                    "message": "Please enter at least one contact detail",
                    "value": "705,706,707"
                },
                {
                    "type": "email",
                    "message": "Please enter a valid email address"
                }
            ]
        },
        {
            "id": 707,
            "pageId": 102,
            "sectionId": 1,
            "title": "What is their mail address?",
            "shortTitle": "Address",
            "order": 7,
            "clearRequired": false,
            "questionType": "address",
            "validations": [
                {
                    "type": "ormandatoryset",
                    "message": "Please enter at least one contact detail",
                    "value": "705,706,707"
                },
                {
                    "type": "address",
                    "message": "Please enter a valid address"
                },
                {
                    "type": "maxlength",
                    "message": "Too many characters in address",
                    "value": "400"
                }
            ]
        }
    ]
    }
};

}
export default DataTableColResizeDemo;
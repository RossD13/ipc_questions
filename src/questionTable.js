import React, { Component } from 'react';
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
import {Button} from 'primereact/components/button/Button';
import {InputText} from 'primereact/components/inputtext/InputText';
import {InputTextarea} from 'primereact/components/inputtextarea/InputTextarea';
import {Growl} from 'primereact/components/growl/Growl';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import {Checkbox} from 'primereact/components/checkbox/Checkbox';
import {OrderList} from 'primereact/components/orderlist/OrderList';

var request = require('request');

var questions = require("./questions.json");
var download = require("downloadjs");
const types = [{label: "text", value: "text"}, {label: "checkbox", value: "checkbox"}, {label:"radiobutton", value:"radiobutton"}, {label:"boolean", value:"boolean"},
    {label:"booleanbuttons", value:"booleanbuttons"},{label:"countryselect", value:"countryselect"},{label:"dropdownlist", value:"dropdownlist"},
    {label:"durationpicker", value:"durationpicker"},{label:"name", value:"name"}, {label:"date",value:"date"}];

export class DataTableColResizeDemo extends Component {

    componentDidMount() {

    }


    /**
     * Displays the selected row's data in the footer of the table
     * @param data
     * @returns {*}
     */
    displaySelection(data) {
        if (!data || data.length === 0) {
            this.setState();
            return <div style={{textAlign: 'left'}}>No Selection</div>;
        }
        else {
            return <div style={{textAlign: 'left'}}>Selected Question: {data.id + ' ' + data.title}</div>
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
        return <InputText type="text" value={this.state.questions[props.rowIndex]['id']}
                          onChange={(e) => this.onEditorValueChange(props, e.target.value)}/>;
    }

    /**
     * creates an edit field for the title of the question when it is selected
     * @param props
     * @returns {*}
     */
    descEditor(props) {
        /*console.log(this.state);
        return this.inputTextEditor(props);*/
        return <InputText type="text" value={this.state.questions[props.rowIndex]['title']}
                          onChange={(e) => this.onEditorValueChange(props, e.target.value)}/>;
    }

    /**
     * It seems unlikely that this page would ever be allowed to update all apps for all incoming passengers to Australia
     */
    saveAndPublish() {
        this.growl.show({
            severity: 'success',
            summary: 'Success Message',
            detail: 'Your changes have been saved and are now LIVE all over the world'
        });
    }

    selectChange(e) {
        let selected = this.state.selectedQ1;
        this.setState({selectedQ1: selected});
        this.setState({selectedQ1: e.data});
        this.setState({visible: true});
    }

    onRowEdit(e) {
        console.log(e);
    }

    onHide(event) {
        this.setState({visible: false});
    }

    onOptionsHide(event) {
        this.setState({optionsvisible: false});
    }

    onNewOptionHide(event) {
        this.setState({newoptionvisible: false});
    }

    onNewQuestionsHide() {
        this.setState({newquestionvisible: false});
    }

    updateProperty(property, value) {
        //console.log("this is the event value", value);
        let selected = this.state.selectedQ1;
        selected[property] = value;
        this.setState({selectedQ1: selected});

        //console.log(this.state.selectedQ1.options);
    }

    //*********************** OPTIONS *********************//
    editOptions() {
        if (this.state.selectedQ1.questionType === 'radiobutton' || this.state.selectedQ1.questionType === 'dropdownlist') {
            this.setState({"optionsvisible": true})
        }
    }

    addNewOption() {
        this.setState({newoptionvisible: true})
        this.setState({newOption: ""});
    }

    saveNewOption(e) {
        console.log("new option", this.state.newOption);
        let newOptions = this.state.selectedQ1.options;
        newOptions.push(this.state.newOption);
        console.log('updated options', newOptions);
        this.updateProperty('options', newOptions);
        this.setState({'newOption': ''});
        this.onNewOptionHide();
    }

    deleteOption(e) {
        console.log(this.orderList);
        let newOptions = this.state.selectedQ1.options;
        let deleteIndex = newOptions.findIndex((d) => d == this.orderList.state.selection);
        console.log(deleteIndex, newOptions[deleteIndex]);
        newOptions.splice(deleteIndex, 1);
        console.log('updated options', newOptions);
        this.updateProperty('options', newOptions);
        //
    }

    //////////////////////// CONDITIONS AND VALIDATIONS ///////////////////////////

    showConditions() {
        // create a printable string from the conditions to display on the screen
        let conditions = this.state.selectedQ1.conditions;
        if (typeof(conditions) === 'undefined' || conditions == null
            || conditions.length == 0) {
            return '';
        } else {
            return conditions[0].questionId + ' ' + conditions[0].operation + ' ' + conditions[0].value;
        }
    }

    showValidations() {
        // create a printable string from the validations to show on the screen
        let validations = this.state.selectedQ1.validations;
        if (typeof(validations) === 'undefined' || validations == null) {
            return '';
        } else {
            let retVal = '';
            for (let c in validations) {
                retVal = retVal + validations[c].type + ' ';
            }
            return retVal;
        }
    }

    showMandatory() {
        // so we can display a checkbox for mandatory field
        let validations = this.state.selectedQ1.validations;
        if (typeof(validations) === 'undefined' || validations == null) {
            return false;
        } else {
            let retVal = '';
            for (let c in validations) {
                if (validations[c].type === 'mandatory') {
                    return true;
                }
            }

            return false;
        }
    }
    showValidType() {
        // so we can display a checkbox for mandatory field
        let validations = this.state.selectedQ1.validations;
        if (typeof(validations) === 'undefined' || validations == null) {
            return '';
        } else {
            let retVal = '';
            for (let c in validations) {
                if (validations[c].type === 'mandatory') {
                    // skip
                } else {
                    return validations[c].type;
                }
            }

            return '';
        }
    }


    //////////////////////// UPLOAD QUESTIONS  //////////////////////////
    saveNewQuestions() {
        // take the json uploaded from the user and see if we can use it to replace
        // the current set of questions
        let newQJson = JSON.parse(this.state.newQuestions);
        if (typeof(newQJson.version) !== 'undefined' &&
            typeof(newQJson.pages) !== 'undefined' &&
            typeof(newQJson.sections) !== 'undefined' &&
            typeof(newQJson.questions) !== 'undefined') {
            this.setState({"version": newQJson.version});
            this.setState({"pages": newQJson.pages});
            this.setState({"sections": newQJson.sections});
            this.setState({"questions": newQJson.questions});
        }
        // close the upload dialog
        this.onNewQuestionsHide();
    }

    /**
     * called by the react framework, builds the component which edits the questions.
     * @returns {*}
     */
    render() {
        const selected = this.state.selectedQ1;
        var footer = <div>
            <Button label="Save" icon="fa-save" onClick={(e) => {
                this.onHide(e)
            }}/>
            <Button label="Cancel" icon="fa-close" onClick={(e) => {
                this.onHide(e)
            }}/>
            <Button label="Delete" icon="fa-remove" onClick={(e) => {
                this.onHide(e)
            }}/>
        </div>;

        var optionsfooter = <div>
            <Button label="Save" icon="fa-save" onClick={(e) => {
                this.onOptionsHide(e)
            }}/>
            <Button label="Cancel" icon="fa-close" onClick={(e) => {
                this.onOptionsHide(e)
            }}/>
            <Button label="Delete" icon="fa-minus" onClick={(e) => {
                this.deleteOption(e)
            }}/>
            <Button label="Add" icon="fa-plus" onClick={(e) => this.addNewOption()}/>
        </div>;
        var newOptionfooter = <div>
            <Button label="Save" icon="fa-save" onClick={(e) => {
                this.saveNewOption()
            }}/>
            <Button label="Cancel" icon="fa-close" onClick={(e) => {
                this.onNewOptionHide(e)
            }}/>

        </div>;
        var newQuestionfooter = <div>
            <Button label="Save" icon="fa-save" onClick={(e) => {
                this.saveNewQuestions()
            }}/>
            <Button label="Cancel" icon="fa-close" onClick={(e) => {
                this.onNewQuestionsHide(e)
            }}/>

        </div>;

        return (

            <div>
                <Growl ref={(el) => {
                    this.growl = el;
                }}></Growl>
                <h3>IPC Questions</h3>
                <div>
                    Version <InputText value={this.state.version}
                                       onChange={(e) => this.setState({version: e.target.value})}/>
                </div>

                <DataTable value={this.state.questions} resizableColumns={true} scrollable={true} scrollHeight="300px"
                           editable={false}
                           selectionMode="single" selection={this.state.selectedQ1}
                           onSelectionChange={(e) => this.selectChange(e)}>
                    <Column field="id" header="Id" style={{width: '10%'}} sortable={false}/>
                    <Column field="pageId" header="Page ID" style={{width: '10%'}} sortable={false}/>
                    <Column field="title" header="Question text" style={{width: '70%'}}
                            sortable={false} /*editor={(p) =>this.descEditor(p)} *//>
                    <Column field="questionType" header="Type" style={{width: '20%'}}/>
                    <Column field="options" header="Options" style={{width: '20%'}}/>
                </DataTable>
                <div class="ui-g">
                    <div class="ui-g-3"><Button label="Save and Publish" onClick={() => this.saveAndPublish()}/></div>
                    <div class="ui-g-3"><Button label="Save a Copy" onClick={() => this.saveACopy()}/></div>
                    <div class="ui-g-3"><Button label={"Upload a Version"} name={'uploadButton'}
                                                onClick={() => this.setState({newquestionvisible: true})}/></div>
                    <div class="ui-g-2"/>
                    <div class="ui-g-1"><Button label="Cancel"/></div>
                </div>
                <div>
                    <Dialog header="Edit Question" visible={this.state.visible} width="650px" modal={true}
                            onHide={(e) => this.onHide(e)}
                            footer={footer}>
                        <div>
                            <div className="content-section implementation">
                                <div class="ui-g">
                                    <div class="ui-g-4">ID</div>
                                    <div class="ui-g-4">Page Id</div>
                                    <div class="ui-g-4">Type</div>
                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-4"><InputText value={this.state.selectedQ1.id}
                                                                   onChange={(e) => this.updateProperty('id', e.target.value)}/>
                                    </div>
                                    <div class="ui-g-4"><InputText value={this.state.selectedQ1.pageId}
                                                                   onChange={(e) => this.updateProperty('pageId', e.target.value)}/>
                                    </div>
                                    <div class="ui-g-4"><Dropdown optionLabel="label" options={types}
                                                                  style={{width: '150px'}} placeholder="Select a type"
                                                                  value={{
                                                                      label: this.state.selectedQ1.questionType,
                                                                      value: this.state.selectedQ1.questionType
                                                                  }}
                                                                  onChange={(e) => this.updateProperty('questionType', e.value.value)}/>
                                    </div>
                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-12">Question text</div>
                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-112"><InputText value={this.state.selectedQ1.title}
                                                                     onChange={(e) => this.updateProperty('title', e.target.value)}
                                                                     size={60}/>
                                    </div>

                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-4">Short title</div>
                                    <div class="ui-g-4">Order</div>
                                    <div class="ui-g-4">Clear required</div>
                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-4"><InputText value={this.state.selectedQ1.shortTitle}
                                                                   onChange={(e) => this.updateProperty('shortTitle', e.target.value)}/>
                                    </div>
                                    <div class="ui-g-4"><InputText value={this.state.selectedQ1.order}
                                                                   onChange={(e) => this.updateProperty('order', e.target.value)}/>
                                    </div>
                                    <div class="ui-g-4"><Checkbox checked={this.state.selectedQ1.clearRequired}
                                                                  onChange={(e) => this.updateProperty('clearRequired', e.checked)}/>
                                    </div>
                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-4">Validations</div>
                                    <div className="ui-g-4">Conditions</div>
                                    <div class="ui-g-4">Options</div>

                                </div>
                                <div class="ui-g">
                                    <div class="ui-g-4">Mandatory <Checkbox checked={this.showMandatory()}/>
                                        <div>Type {this.showValidType()} </div></div>
                                    <div class="ui-g-4"><InputText value={this.showConditions()} width={10}/></div>
                                    <div class="ui-g-4"><InputText value={this.state.selectedQ1.options}
                                                                   onFocus={() => this.editOptions()}/></div>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
                <div>
                    <Dialog header="Edit Question Options" visible={this.state.optionsvisible} width="450px"
                            modal={true} onHide={(e) => this.onOptionsHide(e)}
                            footer={optionsfooter}>
                        <div>
                            <div className="content-section implementation">
                                <div class="ui-g">
                                    <OrderList value={this.state.selectedQ1.options} //scrollHeight="300px"
                                               ref={(OrderList) => {
                                                   this.orderList = OrderList;
                                               }}
                                               onChange={(e) => this.updateProperty("options", e.value)}>
                                    </OrderList>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
                <div>
                    <Dialog header="New Option" visible={this.state.newoptionvisible} width="450px" modal={true}
                            onHide={(e) => this.onNewOptionHide(e)}
                            footer={newOptionfooter}>
                        <div>
                            <div className="content-section implementation">
                                <div class="ui-g">
                                    <div class="ui-g-4">New Option</div>
                                    <InputText value={this.state.newOption}
                                               onChange={(e) => this.setState({newOption: e.target.value})}/>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>

                <div>
                    <Dialog header="Upload a Question set" visible={this.state.newquestionvisible} width="450px"
                            modal={true} onHide={(e) => this.onNewQuestionsHide(e)}
                            footer={newQuestionfooter}>
                        <div>
                            <div className="content-section implementation">
                                <div class="ui-g">
                                    <div class="ui-g-4">Paste json content here</div>
                                    <InputTextarea rows={10} cols={130} value={this.state.newQuestions}
                                                   onChange={(e) => this.setState({newQuestions: e.target.value})}/>
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
        var quest = {};
        quest.version = this.state.version;
        quest.categories = this.state.categories;
        quest.pages = this.state.pages;
        quest.sections = this.state.sections;
        quest.questions = this.state.questions;

        quest.questions.forEach(function (q) {
            delete q._$visited;
        });
        quest.questions.sort(function (a, b) {
            return a.id - b.id
        });

        download('data:text/plain,' + encodeURIComponent(JSON.stringify(quest, null, 2)),
            'questions' + this.state.version + '.json',
            'text/plain');

    }


    constructor() {
        super();
        this.selectChange = this.selectChange.bind(this);


        this.state = {
            selectedQ1: {},
            version: questions.version,
            categories: questions.categories,
            pages: questions.pages,
            sections: questions.sections,
            questions: questions.questions
        };
    }
}
export default DataTableColResizeDemo;
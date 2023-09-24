import { useState } from "react";
import { Button, Segment, Form, Grid, Select } from "semantic-ui-react";
import axios from 'axios';

export default function Drops(params) {
    let initialFormData = {
        "dropId": "",
        "name": "",
        "description": ""
    };
    const [formData, setFormData] = useState(initialFormData);

    const updateInputValue = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const submitData = () => {        
        axios.post("http://localhost:8080/drop/save", formData)
        .then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });

        setFormData({...initialFormData});
    }

    return (
        <Grid.Column>
            <Segment>
                <Form>
                    <Form.Field>
                        <label id="dropId">Drop Id</label>
                        <Form.Input id="dropId" value={formData.dropId} onChange={updateInputValue} />
                    </Form.Field>
                    
                    <Form.Field>
                        <label id="name">Name</label>
                        <Form.Input id="name" value={formData.name} onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label id="description">Description</label>
                        <Form.Input id="description" value={formData.description} onChange={updateInputValue} />
                    </Form.Field>

                    <Button onClick={submitData}>
                        Save Item
                    </Button>
                </Form>
            </Segment>
        </Grid.Column>
    );
}
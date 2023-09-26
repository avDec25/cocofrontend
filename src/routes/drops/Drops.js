import { useState } from "react";
import { Segment, Form, Grid } from "semantic-ui-react";
import { Button } from "antd";
import axios from 'axios';
import * as CONST from "../../Constants";
import toast from "react-hot-toast";

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
        toast.promise(
            axios.post(`http://${CONST.BACKEND}/drop/save`, formData),
            {
                loading: 'Registering Drop',
                success: (response) => `Success! ${response.data.message}`,
                error: 'Error: Registration Failed',
            }
        );

        setFormData({ ...initialFormData });
    }

    return (
        <Grid.Column>
            <Segment>
                <Form>
                    <Form.Field>
                        <label htmlFor="dropId">Drop Id</label>
                        <Form.Input id="dropId" value={formData.dropId} onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="name">Name</label>
                        <Form.Input id="name" value={formData.name} onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="description">Description</label>
                        <Form.Input id="description" value={formData.description} onChange={updateInputValue} />
                    </Form.Field>

                    <Button type="primary" onClick={submitData}>Register Drop</Button>
                </Form>
            </Segment>
        </Grid.Column>
    );
}
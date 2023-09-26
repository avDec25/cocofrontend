import { useState } from "react";
import { Segment, Form, Grid } from "semantic-ui-react";
import { Button } from "antd";
import axios from 'axios';
import * as CONST from "../../Constants";
import toast from "react-hot-toast";

export default function Customers(params) {
    let initialFormData = {
        "sheetId": "1qo5WVayHHOOjcG02cvXnvFl-LINb_uaDrZbI4btTnq4",
        "range": "A2:G"
    };
    const [formData, setFormData] = useState(initialFormData);

    const updateInputValue = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const submitData = () => {
        toast.promise(
            axios.post(`http://${CONST.BACKEND}/customer/import`, formData), 
            {
                loading: 'Syncing Customers from Google Sheet',
                success: (response) => `Success! ${response.data.message}`,
                error: 'Error: Could not Sync',
            }
        );
        setFormData({ ...initialFormData });
    }

    return (
        <Grid.Column>
            <Segment>
                <Form>
                    <Form.Field>
                        <label htmlFor="sheetId">Sheet Id</label>
                        <Form.Input id="sheetId" value={formData.sheetId} onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="range">Range</label>
                        <Form.Input id="range" value={formData.range} onChange={updateInputValue} />
                    </Form.Field>

                    <Button type="primary" onClick={submitData}>Sync from Google Sheet</Button>
                </Form>
            </Segment>
        </Grid.Column>
    );
}
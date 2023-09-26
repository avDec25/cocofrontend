import { useState, useEffect } from "react";
import { Segment, Form, Grid } from "semantic-ui-react";
import { Button } from "antd";
import { Select } from 'antd';
import * as CONST from "../../Constants";
import axios from 'axios';
import toast from "react-hot-toast";

export default function Items(params) {
    useEffect(() => {
        fetch(`http://${CONST.BACKEND}/drop/list/id`)
            .then(response => response.json())
            .then(json => setOptions(json))
            .catch(error => console.error(error));
    }, []);

    let initialFormData = {
        "name": "",
        "dropId": "",
        "costPrice": "",
        "sellingPrice": "",
        "shipping": "",
        "image": ""
    };

    const [dropIdOptions, setdropIdOptions] = useState([]);
    const [formData, setFormData] = useState(initialFormData);

    const setOptions = (json) => {
        var options = []
        json.message.split(',').forEach((x) => {
            options.push(
                { 'label': x, 'value': x }
            )
        })
        setdropIdOptions(
            options
        );
    }


    const updateInputValue = (e) => {
        if (e.target.id === 'image') {
            setFormData({ ...formData, [e.target.id]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.id]: e.target.value });
        }
    }
    const updateDropId = (e, val) => {
        setFormData({ ...formData, 'dropId': val });
    }

    const submitData = () => {
        toast.promise(
            axios.post(`http://${CONST.BACKEND}/item/save`, formData),
            {
                loading: 'Adding Item to Drop',
                success: (response) => `Success! ${response.data.message}`,
                error: 'Error: Could not add item',
            }
        );

        setFormData({
            ...formData,
            "name": "",
            "costPrice": "",
            "sellingPrice": "",
            "shipping": ""
        });
    }

    return (
        <Grid.Column>
            <Segment>
                <Form>
                    <Form.Field>
                        <label htmlFor="name">Name</label>
                        <Form.Input id="name" value={formData.name} onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="image">Image</label>
                        <input type="file" id="image"
                            onChange={updateInputValue}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="dropId">Drop Id</label>
                        <Select
                            id="dropId"
                            placeholder='Select a Drop Id'
                            style={{ width: '100%' }}
                            options={dropIdOptions}
                            onChange={(e, { value }) => updateDropId(e, value?.toString())}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="costPrice">Cost Price</label>
                        <Form.Input value={formData.costPrice} id="costPrice" onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="sellingPrice">Selling Price</label>
                        <Form.Input value={formData.sellingPrice} id="sellingPrice" onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="shipping">Shipping</label>
                        <Form.Input value={formData.shipping} id="shipping" onChange={updateInputValue} />
                    </Form.Field>

                    <Button type="primary" onClick={submitData}>Save Item</Button>
                </Form>
            </Segment>
        </Grid.Column>
    );
}
import { useState, useEffect } from "react";
import { Button, Segment, Form, Grid, Select } from "semantic-ui-react";
import axios from 'axios';

export default function Items(params) {
    useEffect(() => {
        fetch('http://localhost:8080/drop/list/id')
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
                { 'key': x, 'value': x, 'text': x }
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
        console.log(formData);
        axios.postForm(
            "http://localhost:8080/item/save", 
            formData
        )
        .then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });

        setFormData({...initialFormData});
        console.log(formData);
    }

    return (
        <Grid.Column>
            <Segment>
                <Form>
                    <Form.Field>
                        <label id="name">Name</label>
                        <Form.Input value={formData.name} id="name" onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label id="image">Image</label>
                        <input type="file" id="image"
                            onChange={updateInputValue}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label id="dropId">Drop Id</label>
                        <Select
                            id="dropId"
                            placeholder='Select a Drop Id'
                            options={dropIdOptions}
                            onChange={(e, { value }) => updateDropId(e, value?.toString())}
                        />
                    </Form.Field>


                    <Form.Field>
                        <label id="costPrice">Cost Price</label>
                        <Form.Input value={formData.costPrice} id="costPrice" onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label id="sellingPrice">Selling Price</label>
                        <Form.Input value={formData.sellingPrice} id="sellingPrice" onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label id="shipping">Shipping</label>
                        <Form.Input value={formData.shipping} id="shipping" onChange={updateInputValue} />
                    </Form.Field>

                    <Button onClick={submitData}>
                        Save Item
                    </Button>
                </Form>
            </Segment>
        </Grid.Column>
    );
}
import { Form } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useFormField from '@hooks/useFormField';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import apiConfig from '@constants/apiConfig';
import { sendRequest } from '@services/api';
const AlignStyle = ReactQuill.Quill.import('attributors/style/align');
ReactQuill.Quill.register(AlignStyle, true);
function getLoader() {
    const div = document.createElement('div');
    div.className = 'loader-container';
    div.innerHTML = "<div class='loader'>Loading...</div>";
    return div;
}
const uploadFile = async (file) => {
    try {
        const { data } = await sendRequest(apiConfig.file.upload, {
            data: {
                type: 'LOGO',
                file: file,
            },
        });
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};
const formats = [
    'header',
    'font',
    'size',
    'color',
    'background',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'align',
    'list',
    'bullet',
    'indent',
    'image',
];
const RichTextField = (props) => {
    const { label, disabled, name, required, style, labelAlign, formItemProps, baseURL, form, setIsChangedFormValues } =
        props;
    const { rules } = useFormField(props);
    const reactQuill = useRef();
    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    [{ color: [] }, { background: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                    ['image'],
                    ['clean'],
                ],
                handlers: {
                    // handlers object will be merged with default handlers object
                    image: () => {
                        const input = document.createElement('input');

                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
                        input.click();

                        input.onchange = async () => {
                            var file = input.files[0];
                            var formData = new FormData();
                            formData.append('image', file);
                            const res = await uploadFile(file);

                            const range = reactQuill.current.getEditor().selection;
                            reactQuill.current
                                .getEditor()
                                .insertEmbed(range.lastRange.index, 'image', baseURL + res.data.filePath);
                        };
                    },
                },
            },
            clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
            },
        };
    }, []);
    if (ReactQuill) {
        return (
            <Form.Item
                {...formItemProps}
                required={required}
                labelAlign={labelAlign}
                name={name}
                label={label}
                rules={rules}
                initialValue=""
            >
                <ReactQuill
                    ref={reactQuill}
                    style={style}
                    formats={formats}
                    modules={modules}
                    readOnly={disabled}
                    onChange={(value) => {
                        form.setFieldValue(name, value);
                        setIsChangedFormValues(true);
                    }}
                    value={form.getFieldValue(name)}
                />
                <></>
            </Form.Item>
        );
    }
};

export default RichTextField;

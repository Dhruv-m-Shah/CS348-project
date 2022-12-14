import React, { useState, useMemo, useCallback } from "react";
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Container } from '@mui/system';
import { Button, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};


function AddGamePage({ theme }) {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        console.log(acceptedFiles);
        setFiles(acceptedFiles);
    }, [])

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({ onDrop });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    function handleSubmit(event) {

      var fileTexts = []
      var count = 0
      for (var file of files) {
        event.preventDefault()
  
        var reader = new FileReader();
    
        reader.onload = async function(event) {
          console.log(files.length)

          let arr = event.target.result.split(/\-0\s/);


            for (var i = 0; i < arr.length; i++) { 
                var element = arr[i]
     
                if (element.charAt(element.length - 2) !== '-') {
                    element += "-0"
                }
    
                let inner = element.split(/\-1\s/)

                for (var j = 0; j < inner.length; j++) { 
                    var e = inner[j]
    
                    if (e.charAt(e.length - 2) !== '-') {
                        e += "-1"
                    }
                    fileTexts.push(e)
                }
            }



          count += 1
        if (count === files.length) {
            for (var i = 0; i < fileTexts.length; i = i + 20) { 
                sendFiles(fileTexts.slice(i, i + 20))
            }
          }
        };
    
        reader.readAsText(file);
      }

      files.length > 0
        ? toast.success(`Successfully added game(s)!`, {
        position: 'top-right',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme,
      })
      : toast.error(`Please select a file!`, {
        position: 'top-right',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme,
      });
      acceptedFiles.splice(0, acceptedFiles.length);
      setFiles([]);
    }
  
    function sendFiles(fileTexts) {
      const url = 'http://localhost:5000/api/addGame';
      axios.post(url, {"str": fileTexts}).then(function (response) {
        console.log(response);
      })
    }

    const uploadedFileList = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.type} - {file.size} bytes
        </li>
    ));

    return (
        <div className="AddGame" style={{ marginTop: '20px' }}>
            <Container maxWidth="lg">
                <Typography variant="h5" component="h2">
                    Add a game
                </Typography>
                <br />
                <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                    <ul>{uploadedFileList}</ul>
                </div>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    style={{ margin: '10px 0px', padding: '10px' }}
                >
                    Submit Game(s)
                </Button>
            </Container>
            <ToastContainer />
        </div>
    );
}

export default AddGamePage;
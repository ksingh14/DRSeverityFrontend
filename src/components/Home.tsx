import React, { useState } from 'react'
import {
  Box,
  Stack,
  Container,
  Typography,
  Button,
  Link,
  Avatar,
  useMediaQuery,
  Grid,
  TextField,
  Grid2ClassKey,
  Paper,
} from '@mui/material'
import axios from 'axios'
import '../Styles/Home.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress, {CircularProgressProps} from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { VisuallyHiddenInput } from '@chakra-ui/react'
import Slide from '@mui/material/Slide';

interface props {
  // pred_text: string
}

const style = {
  input: {
    display: 'none',
  },
}

var map_class_names = new Map<string, string>([
  ["0", "No DR"],
  ["1", "Mild DR"],
  ["2", "Moderate DR"],
  ["3", "Severe DR"],
  ["4", "Proliferative DR"],
])

var map_class_colors = new Map<string, string>([
  ["0", "#00FF00",],
  ["1", "#739900"],
  ["2", "#cccc00"],
  ["3", "#cc6600"],
  ["4", "#ff3300"],
])

var map_descriptions = new Map<string, string>([
  ["0", "No DR detected in retinal scan!"],
  ["1", "Schedule an appointment with an ophthalmologist as soon as possible for a comprehensive eye examination."],
  ["2", "The severity of DR could be urgent. Seek evaluation by an ophthalmologist as soon as possible to start \
      diagnosis process."],
  ["3", "Seek immediate evaluation by an ophthalmologist. Severe DR has a high risk of turning into vision-threatening complications, and the DR could be \
      close to developing into proliferative DR"],
  ["4", "Seek immediate evaluation by an ophthalmologist, as proliferative DR requires prompt treatment to prevent vision loss and complications"]
])

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2, color: "#ffffff"}}>
      <CircularProgress size="5rem" color={props.value==100 ? 'success' : 'inherit'}
      // variant="determinate" {...props} 
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h5"
          component="div"
          color="text.secondary"
        >
           <Box color={props.value==100 ? '#5faf61' : '#ffffff'} sx={{fontWeight: 'bold'}} display='inline'>
           {`${Math.round(props.value)}%`}
           </Box>
          
        </Typography>
      </Box>
    </Box>
  );
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}


export default function Home({ }: props) {
  let isLargeScreen = useMediaQuery('(min-width:450px')
  const [retina_file_url, setFileURL] = useState("");
  const [open, setOpen] = React.useState(false);

  const [prediction, setPrediction] = useState<string>("");

  const [uploadProgress, setUploadProgress] = React.useState(0);

  // Arrow stuff
  const rootStyle = { display: "flex", justifyContent: "center" };
  const rowStyle = {
    margin: "200px 0",
    display: "flex",
    justifyContent: "space-between",
  };

  const boxStyle = { padding: "10px", border: "1px solid black" };

  const apiCall = async (file: string) => {
    try {
     //const url = 'http://localhost:8080/translate/text'
     const url = 'http://localhost:8080/predict'
      const { data } = await axios.post(url, { 'image': file })
      console.log(data)

      // box.length = 0;

      // // I initiated days as 0 instead of 31 and if days are less than 31 then
      // // for loop iterates over it until it reaches that number.
      // for (let gloss in output.links) {
      //   // Then the code pushes each time it loops to the empty array I initiated.
      //   let link = output.links[gloss as keyof typeof output.links];
      //   box.push(
      //     <Grid item>
      //       <ReactPlayer url='https://aslsignbank.haskins.yale.edu/dictionary/protected_media/glossvideo/ASL/GR/GRANDFATHER-1863.mp4'
      //   type="video/mp4"
      //   controls //If you want play button or not
      //   playing //If you want autoplay or not
      //    />
      //     </Grid>
      //   );
      // }
    } catch (err:any) {
      console.log(err)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling file change")
    setFileURL("");
    if (event.target.files && event.target.files.length > 0) {
      console.log("setting file")
      //setFile(event.target.files[0]);

      const url = URL.createObjectURL(event.target.files[0]);
      setFileURL(url);

      console.log(event.target.value)

      // Get prediction
      handleSubmit(event, event.target.files[0]);
    } else {
      console.log("no files")
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<any>, file: File) => {
    e.preventDefault();
    console.log("handling submit")
    if (file) {
      console.log("sending file for prediction")
      const url = 'http://localhost:8080/predict'
      const formData = new FormData();
      formData.append('image', file);
      // Reset things
      setUploadProgress(0);
      setOpen(true);
      setPrediction("");

      const { data } = await axios.post(url, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted - 20);
          }
          // for (let i=0; i<100; i+=5) {
          //   setUploadProgress(i)
          //   await delay(400);
          // }
        }
      })

      // Prediction done, set upload to 0
      setUploadProgress(100);
      await delay(1000);
      setOpen(false);
      await delay(500);

      // Set prediction
      console.log(data);
      setPrediction(data.prediction_category.toString());
      console.log(prediction);

      // Reset progress
      setUploadProgress(0);
    }
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  return (
    <Box 
    sx={{ pt: 4, pb: 6 }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        {/* <Avatar alt={name} src={img} sx={{ width: 100, height: 100 }} /> */}
        {/* <Typography
          variant={isLargeScreen ? 'h1' : 'h2'}
          textTransform="uppercase">
          {name}
        </Typography> */}
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            // onClick={handleClose}
          >
          <CircularProgressWithLabel variant="determinate" value={uploadProgress} />
          </Backdrop>
        <Typography variant={isLargeScreen ? 'h3' : 'h4'}>
          Upload your retina image!
        </Typography>
        <Grid container wrap='nowrap' style={{ gap: 5 }} alignItems="center" justifyContent="center">
        <div>
        <form >
            {/* <Button type='submit' variant="contained" sx = {{mt: 3}} >Submit</Button> */}
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              sx = {{mt: 3}}
              startIcon={<CloudUploadIcon />}
            >
              Upload
              <VisuallyHiddenInput 
                type="file" 
                onChange={handleFileChange} 
                // onChange={(event) => {
                //   console.log("hi")
                // }}
              />
            </Button>
          </form>
          
          <Grid item xs={1} />
            <Grid item xs={10} style={{ display: "flex", gap: "1rem" }}>
            <Slide direction="right" in={retina_file_url != ""} mountOnEnter unmountOnExit>
            <Container sx={{mt: 2}}>
              {/* <div className="image-container"> */}
                <img src={retina_file_url} />
              {/* </div> */}
            </Container>
            </Slide>
            {/* <Slide direction="left" in={retina_file_url != ""} mountOnEnter unmountOnExit>
              <Typography sx={{mt: 2, ml: 2}}>{"hello"}</Typography>
            </Slide> */}
           <Stack spacing={2} sx={{mt: 2,}}>
            <Slide direction="left" in={prediction != ""} mountOnEnter unmountOnExit>
              <Typography variant="h3" sx={{mt: 2, color: prediction ? map_class_colors.get(prediction) : ""}}>{(prediction ? map_class_names.get(prediction) : "")}</Typography>
            </Slide>
            <Slide direction="left" in={prediction != ""} mountOnEnter unmountOnExit>
              <Typography sx={{mt: 2,}}>{(prediction ? map_descriptions.get(prediction) : "")}</Typography>
            </Slide>
          </Stack>
            {/* <Slide direction="left" in={prediction != null} mountOnEnter unmountOnExit>
              <Typography sx={{mt: 2,}}>{(prediction ? map_descriptions[prediction] : "")}</Typography>
            </Slide> */}
            
            </Grid>
            
          
        </div>
        {/* <Grid item xs={1} />
          <Grid item xs={10} style={{ display: "flex", gap: "1rem" }}>
            <Typography>{"hi"}</Typography>
            <img  src={retina_file_url}></img>
            <Typography>{"hello"}</Typography>
            </Grid>
          <Grid item xs={1} /> */}

        </Grid>
      </Container>
    </Box>
  )
}

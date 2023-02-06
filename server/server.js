import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration,OpenAIApi } from 'openai';

dotenv.config();

console.log(process.env.OPENAI_API_KEY)
const configuration = new Configuration({
apiKey : process.env.OPENAI_API_KEY,

});

const openai = new OpenAIApi(configuration);
const app =express();
app.use(cors());
app.use(express.json());
app.get('/', async(req,res)=>{
    res.status(200).send({
        message : 'hellow flow citizens',
    })
});

app.post('/',async(req,res)=>{

try{

    const prompt=req.body.prompt;

    const response = await openai.createCompletion({
        model: "text-davinci-003",
  prompt: `'${prompt}'`,
  temperature: 0,
  max_tokens: 3500,
  top_p: 1,
  frequency_penalty: 0.5,
  presence_penalty: 0,
    });

res.status(200).send({
    bot : response.data.choices[0].text
})

}catch(error){

    console.log(error);
    res.status(500).send({error})
}

})

app.listen(5000, () => console.log(`Server is running on port http://localhost:${process.env.PORT}`));
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { Configuration, OpenAIApi } = require('openai');

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// });

// const openai = new OpenAIApi(configuration);
// const app = express();
// app.use(cors(), express.json());

// app.get('/', (req, res) => {
//   res.status(200).send({ message: 'Hello flow citizens' });
// });

// app.post('/', async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     const { data: { choices: [{ text: bot }] } } = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `'${prompt}'`,
//       temperature: 0,
//       max_tokens: 3500,
//       top_p: 1,
//       frequency_penalty: 0.5,
//       presence_penalty: 0
//     });

//     res.status(200).send({ bot });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error });
//   }
// });

// app.listen(process.env.PORT, () => console.log(`Server is running on port http://localhost:${process.env.PORT}`));

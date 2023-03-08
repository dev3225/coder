import express from 'express';      //web application framework for node.js
import * as dotenv from 'dotenv';
import cors from 'cors';        //Cross Origin Resourse Sharing
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();        // Allows us to use dotenv variables

//console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//Creating instances for openai
const openai = new OpenAIApi(configuration);

//Initializing our express application by calling it as a function
const app = express();
app.use(cors());
app.use(express.json());        //Allows us to handle json requests from front-end to back-end

//Route handler setup
app.get('/', async (req, res) => {
    res.status(200).send({          //200 - OK
        message: 'Hello from coder!!',
    })
});

app.post('/', async (req, res) => {        //Post data from backend to frontend
    try {
        const prompt = req.body.prompt;
        console.log(prompt);

        const response = await openai.createCompletion({        //Get a response from openai //function(createCompletion) that accepts an object
            model: "text-davinci-003",      //any GPT model can be used but I am using this because it has better processinf between text and code generation
            prompt: `${prompt}`,
            temperature: 0,       //Higher number allows the model to return riskier solutions rather than precise(eg: 0.5, 0.7,etc.,)
            max_tokens: 3000,     //Longer responses are possible. default - 64 
            top_p: 1,
            frequency_penalty: 0.5,     //penality if sentences are repeated.
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
            console.log(error);
            res.status(500).send({error})
    }
})

app.listen(1008,() => console.log('Server is running on port http://localhost:1008'));

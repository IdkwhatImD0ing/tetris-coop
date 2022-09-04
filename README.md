# Tetris Duels

[Website, try it out!](https://tetrisduels.hop.sh/)

[Video Demo](https://youtu.be/oNkD-kUWgVY)

## Inspiration

The original prompt was to build a realtime game using Hop. My first idea was to build a multiplayer retro game. First, I thought about creating a multiplayer pong game, but immediately scrapped the idea due to pong being too easy. Next, was Pac man, and again was scrapped due to the need to create different layouts. My last and final idea was Tetris, which relies heavily more on skill than luck.

## What it does

Tetris Duels lets you play Tetris alone or with family and friends. Compete to see who can get the highest score!

## How we built it

The front end was built using react and the backend was build using expressjs.
Both were deployed using hop.io ignite.
Hop.io Channels were used to maintain a state between the client, server, and different users.

## Challenges we ran into

The biggest challenge was not knowing any react, expressjs, and hop.iom prior to this hackathon and doing it solo.

## Accomplishments that we're proud of

Was able to successfully make a front end and backend and deploy it on hop.io
Managed to finish 2/3 of planned features after pulling an all nighter.

I used search params in the versus mode to allow for links to be shared between friends and family to allow them to join and spectate the match. This wouldn't have been possible without some really complicated objects in both hop and the server.

## What we learned

Learned a great deal about react and expressjs. For example, I learned how to utilize both useState and useRef hooks in react to get state even with outdated references. Also learned how to use react router.

I also learned how to handle http requests from client to server and http response from server to client.

## Experience with hop

At first, my experience with hop was terrible. The documentation was a bit sparse, and it was hard to find the necessary imports and functions.

However, once I figured out what imports and functions to use, the rest was very intuitive. Hop Channels was basically another state variable, and hop ignite was very similar to other deployment apps I've used in the past.

## What I would change if I could do it again

Find a teammate to work with so I would be less stressed and maybe learn some more stuff.

## Favorite part of project

Probably the versus mode since it took me almost 36 hours to implement.

## What's next for Tetris Duels

In the future, I plan on making the UI much better. We ran out of time making the project, so the UI was thrown together in less than an hour.

Furthermore, I plan on adding more modes not just limited to the co-op mode. For example, a timed versus mode where the objective is to score as many points as possible in a timeframe. Mode will have more controls as well. For example, resetting a game, or leaving a position.

Right now, when a lobby is created, it stays forever. Once Hop adds ephemeral channels, I will incorporate them into my project so that the channels delete once all players exit from the room.

Sometimes the multiplayer lags. I am unsure if it is because of network connection or server wise, but I hope to try my best to alleviate that issue.

We hope that this project would be fun for students and the general public.

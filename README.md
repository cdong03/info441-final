# Info 441 Final Project Proposal
## Project Description

Our application is an art-sharing platform where users can post their art and comment on other people’s art. Users can also make public and private galleries of art.

Our target audience is artists of a young age who enjoy communicating about their shared hobby. While older artists may sell their art privately, younger artists–inexperienced ones in particular–draw primarily for fun and may post their art without care of who sees it. Teenagers and young adults may enjoy forming groups where they post similar artworks as fanart.

The audience will want to use this application because other art sites, such as Deviantart, have not adjusted well to the modern day. Deviantart only updated its UI to appear more modern in 2019, and it has received backlash for its handling of AI artwork. Our application will be targeted toward the people who are dissatisfied with older applications.

As developers we want to build this application for young artists no different from some of our own team members. On non-art social media, art often doesn’t receive as much notice as other types of posts, which may discourage aspiring artists. We want to create a welcoming environment for those people.

## Technical Description

### Architectural Diagram
![archdiagram441](https://github.com/cdong03/info441-final/assets/91906348/3c5b4083-2bfe-4578-bf6e-09eb2737f323)

### Summary Table


### Endpoints

GET /art/{id}\
GET /user/{id}\
GET /gallery/{id}\
POST /user/{id}\
POST /art/{id}\
POST /gallery/{id}\
POST /comment/{id}\
DELETE /user/{id}\
DELETE /art/{id}\
DELETE /gallery/{id}

### Database Schemas

User: Name, description, profile picture, galleries, artworks, liked artworks\
Art: Users who liked it, amount of likes, img url, img alt text, title, comments, artist, galleries\
Comment: User, comment text, art\
Gallery: Users allowed to add to gallery, artworks

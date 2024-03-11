# Info 441 Final Project Proposal
## Project Description

Link: https://www.websharer-parker.me/

Our application is an art-sharing platform where users can post their art and comment on other people’s art. Users can also make public and private galleries of art.

Our target audience is artists of a young age who enjoy communicating about their shared hobby. While older artists may sell their art privately, younger artists–inexperienced ones in particular–draw primarily for fun and may post their art without care of who sees it. Teenagers and young adults may enjoy forming groups where they post similar artworks as fanart.

The audience will want to use this application because other art sites, such as Deviantart, have not adjusted well to the modern day. Deviantart only updated its UI to appear more modern in 2019, and it has received backlash for its handling of AI artwork. Our application will be targeted toward the people who are dissatisfied with older applications.

As developers we want to build this application for young artists no different from some of our own team members. On non-art social media, art often doesn’t receive as much notice as other types of posts, which may discourage aspiring artists. We want to create a welcoming environment for those people.

## Technical Description

### Architectural Diagram
![archdiagram441](https://github.com/cdong03/info441-final/assets/91906348/3c5b4083-2bfe-4578-bf6e-09eb2737f323)

### Summary Table

| Priority |    User   |                           Description                          |                                                                    Technical Implementation                                                                   |
|:--------:|:---------:|:--------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| P0       | As a user | I want to create public/private galleries of art.              | Create Users, Art, and Galleries databases in MongoDB. For the galleries, reference the Users and Art databases to add those specific subjects.               |
| P0       | As a user | I want to post art.                                            | Create a form input that makes a POST request that adds an artwork to the database.                                                                           |
| P1       | As a user | I want to be able to comment on art.                           | Create a Comments database that references the Users and Art databases. If replying to a comment, may reference another comment.                              |
| P1       | As a user | I want to see user profiles.                                   | Display user information such as their art, galleries, profile picture, and description.                                                                      |
| P2       | As a user | I want to like artwork.                                        | Create a counter for each artwork that goes up when its specific button is pressed. The button should have a unique ID and be displayed with the image.       |
| P3       | As a user | I don’t want people to be able to like artwork more than once. | In the Art database, keep track of who has liked which artwork. These can also be displayed on the users’ profiles.                                           |
| P3       | As a user | I want to be able to delete art.                               | Add a delete button that only displays if the user is the one who posted the art. If pressed, it checks the user ID and deletes the art from the database(s). |
| P3       | As a user | I want to change my app settings.                              | Use cookies to implement settings like changing how the site looks.                                                                                           |

### Endpoints

![endpoints](https://i.imgur.com/kgBrV30.png)

* GET /art/{id}
    * Gets information about specified artwork.
* GET /user/{id}
    * Gets information about specified user.
* GET /gallery/{id}
    * Gets information about specified gallery.
* POST /user
    * Attempts to add a new user with the given form information.
* POST /art
    * Adds a new artwork with the given form information.
* POST /gallery
    * Creates a new gallery with a given name.
* POST /comment
    * Creates a new comment with the given information.
* DELETE /user/{id}
    * Deletes the specified user.
* DELETE /art/{id}
    * Deletes the specified artwork.
* DELETE /gallery/{id}
    * Deletes the specified gallery.
* DELETE /comment/{id}
    * Deletes the specified comment.

### Database Schemas

Art: Image URL, alt text, title, artist username, likes, date created\
Comment: Username, comment text, art, date created\
Gallery: Title, users allowed to edit, artworks, date created

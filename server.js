//dummy data
const movies = [
    {id: 1, name:"Saving Pvt Ryan", directorId: 1},
    {id: 2, name:"Toy Story 3", directorId: 2}
]
//intitalize everything needed
const exp = require('express')
const expGraphQL = require('express-graphql').graphqlHTTP
const app = exp()
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt
} = require('graphql')

const moviesType = new GraphQLObjectType({
    name:'Movie',
    description:'A movie',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        directorId: {type: GraphQLNonNull(GraphQLInt)}
    })
})
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'The main query for everything.',
    fields: () => ({
        movies: {
            type: new GraphQLList(moviesType),
            description: 'This is a list of all movies in the data.',
            resolve: () => movies
        },
        movie: {
            type: moviesType,
            description: 'A particular movie',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => movies.find(movie => movie.id === args.id)
        }
    })
})
const RootMutation = new GraphQLObjectType({
    name:'Mutate',
    description: 'change information, whether that be add,delete,update. Add a movie',
    fields: () => ({
        addMovie: {
            type: moviesType,
            description: "Add a movie here",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                directorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const movie = { id: movies.length + 1, name: args.name, directorId: args.directorId}
                movies.push(movie)
                return movie
            }
        }
    })
})
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})
app.use('/graphQL-UI', expGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000,() => console.log("Server Running"))
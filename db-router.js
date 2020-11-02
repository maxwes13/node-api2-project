const express = require('express');
const router = express.Router();

const Posts = require('./data/db');


// GET	/api/posts	Returns an array of all the post objects contained in the database.
router.get('/', (req, res)=>{
    Posts.find(req.query)
    .then(posts=>{
        res.status(200).json(posts);
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({
            message: 'Error retrieving the posts'
        });
    });
});

// GET	/api/posts/:id	Returns the post object with the specified id.
router.get('/:id', (req,res)=>{
    
    Posts.findById(req.params.id)
    .then(post =>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({
                message: 'Post not found'
            })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'Error retrieving post'
        })
    })
})


// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments',(req,res)=>{
    const {id} = req.params;
    Posts.findPostComments(id)
    .then(comments =>{
        if(comments){
            res.status(200).json(comments);
            console.log('found comments')
        }else{
            res.status(404).json({
                message: 'Comment not found'
            })
        }
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({
            message: 'Error retrieving comments'
        })
    })
})


// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', async (req,res)=>{
   const commentInfo = {...req.body, post_id: req.params.id};
   if(!commentInfo.text){
       res.status(400).json({
           message:'Provide text for comment'
       })
    }else{
   try{
       const comment = await Posts.insertComment(commentInfo);
       res.status(201).json(comment);
   }catch (error){
    console.log(error);
    res.status(500).json({error});
   }
}
})



// POST	/api/posts	Creates a post using the information sent inside the request body.
router.post('/', (req, res)=>{
   const post = req.body

   if(!post.title || !post.contents){
       res.status(400).json({
           message:'please make sure there is a new Title and Content before posting!'
       })
   } else{
    Posts.insert(post)
    .then(id=>{
        res.status(201).json(id)
    })

    .catch(error =>{
        console.log(error);
        res.status(500).json({
            message: 'Could not add new post'
        })
    })
}
})

// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res)=>{
    Posts.remove(req.params.id)
    .then(count =>{
        if (count > 0){
            res.status(200).json({
                message:'post has been deleted'
            })
        }else{
            res.status(404).json({
                message:'post could not be found'
            })
        }
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json({
            message:'could not delete post'
        })
    })
})


// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/:id',(req,res)=>{
    const changes = req.body;
    Posts.update(req.params.id, changes)
    .then(post =>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({
                message:'post could not be found'
            })
        }
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json({
            message:'could not update post'
        })
    })
})

module.exports = router;
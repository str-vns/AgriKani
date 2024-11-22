const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");
const { CreateBlog } = require('../controllers/blogController');


router.post("/blog", verifyJWT, CreateBlog)
router.get('/blog', blogController.GetAllBlogs);
router.get('/blog/:id', blogController.GetAllBlogs);
router.put('/blog/:id', verifyJWT, blogController.UpdateBlog);
router.delete('/blog/:id',blogController.DeleteBlog);

const blogRoutes = [
  {
    method: METHOD.POST,
    path: PATH.BLOG,
    roles: [],
    handler: blogController.CreateBlog,
  },
    {
    method: METHOD.GET,
    path: PATH.BLOG,
    roles: [],
    handler: blogController.GetAllBlogs,
  },
    {
    method: METHOD.GET,
    path: PATH.BLOG_ID,
    roles: [],
    handler: blogController.GetSingleBlog,
  },
  {
    method: METHOD.PUT,
    path: PATH.BLOG_ID,
    roles: [],
    handler: blogController.UpdateBlog,
  },

  {
    method: METHOD.DELETE,
    path: PATH.BLOG_ID,
    roles: [],
    handler: blogController.DeleteBlog,
  },
//   {
//     method: METHOD.PATCH,
//     path: PATH.BLOG_ID,
//     roles: [],
//     handler: blogController.SoftDeleteBlog,
//   },
//   {
//     method: METHOD.PATCH,
//     path: PATH.RESTORE_BLOG_ID,
//     roles: [],
//     handler: blogController.RestoreBlog,
//   },


];

blogRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  // console.log(`Registering route: ${method.toUpperCase()} ${path}`);
  // console.log(`Handler: ${handler ? 'Defined' : 'Undefined'}`);
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;

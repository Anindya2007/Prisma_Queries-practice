const express = require("express");
const router = express.Router();
const prisma = require("../db");
const bcrypt=require('bcrypt');

router.post("/user", async (req, res) => {
  try {
    const { username, email, fullName, bio, isPrivate , password } = req.body;

    if (!username || !email || !fullName || !password || typeof fullName!=='string' || typeof email!= 'string' || typeof username!=='string' || typeof password!=='string')
      return res.status(409).json({ error: "Required fields missing or wrong datatype provided" });

    const exists = await prisma.user.findFirst({
      where: { email:email}
    });

    if (exists)
      return res.status(409).json({ error: "User already exists" });

    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);

    const user = await prisma.user.create({
      data: { username, email, fullName, bio, isPrivate , password:hashedPassword}
    });

    if (!user){
      return res.status(404).json({message:"Some internal error occured"})
    }

    return res.status(201).json({message:"User regustered successfully",user:{
      id:user.id,
      username:user.username,
      email:user.email,
      fullName:user.fullName,
      bio:user.bio,
      isPrivate:user.isPrivate
    }});

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/user/login',async(req,res)=>{
  try{
    const {email,password}=req.body;

    if (!email || !password || typeof email!=='string' || typeof password!=='string'){
    return res.status(409).json({ error: "Required fields missing or wrong datatype provided" })
  }

    
  }
  catch (err){}
})  

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    const updated = await prisma.user.update({
      where: { id },
      data: {
        fullName: req.body.fullName,
        bio: req.body.bio,
        isPrivate: req.body.isPrivate
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    await prisma.user.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
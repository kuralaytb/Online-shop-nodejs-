const express=require('express')
const mongoose=require('mongoose')

const app=express()

app.set('view engine', 'ejs')

app.use(express.urlencoded())
app.use(express.static(__dirname + '/public'))


mongoose.connect('mongodb://localhost:27017/shop').then(()=>{
    console.log('Connected to mongoDB')
}).catch((e)=>{
    console.log('Failed to connect mongoDB')
})

const ShopSchema= new mongoose.Schema({
    title: String,
    cost:String,
    discount:Number,
    url:String
})

const shop=mongoose.model('products',ShopSchema)


app.post('/new',async(req,res)=>{
    if (req.body.title.length !=0){
        await new shop ({
            title: req.body.title,
            cost: req.body.cost,
            discount: req.body.discount,
            url: req.body.url
        }).save()
        res.redirect('/products')
    } else{
        res.redirect('/new?error=1')
    }
})

app.post('/edit',async (req, res)=>{
    await shop.updateOne(
        {_id:req.body.id},
        { title:req.body.title,
          cost: req.body.cost,
          discount: req.body.discount,
          url:req.body.url
        })
    res.redirect('/products')
})
app.get('/edit/:id',async (req,res)=>{
    const shopData= await shop.findOne({
        _id:req.params.id
    })
    res.render('edit', {data:shopData})
})

app.get('/products', async(req,res)=>{
    const data= await shop.find()
    res.render('index', {data})
})

app.get('/new', (req,res)=>{
    res.render('new')
})



app.get('/item/:id', async(req,res)=>{
    const itemData=await shop.findOne({
        _id:req.params.id
    })
    res.render('item',{data:itemData})
})

app.get('/abc', (req,res)=>{
    res.render('abc')
})

app.delete('/delete/:id',async(req,res)=>{
    await shop.deleteOne({_id:req.params.id})
    res.status(200).send('ok')
})


const PORT=8000
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})
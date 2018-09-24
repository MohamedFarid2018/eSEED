var express = require('express');
var app = express();
var path = require('path')
app.use('/CSS',express.static('CSS'));
app.use('/javascript',express.static('javascript'));
app.use('/images',express.static('images'));
app.use('/html',express.static('html'));
var alert = require("alert-node");
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true   
})); 
//app.use(express.static(__dirname + 'images'));
var mongoose = require('mongoose');
var url = 'mongodb://localhost:3344/eSEED';
var Employee = mongoose.Schema({
    Name:{type:String,default:""},
    Email:{type:String,default:""},
    Mobile_no: {type:Number,default:""},
    HireDate: {type:Date,default:""},
    Status: {type:String,default:""}
 });

var User = mongoose.Schema({
    Name: String,
    Email: String,
    Password: String
});

var Attendance = mongoose.Schema({
    Day: Date,
    Working_hours: Number,
    Employee: String,
    Status: {type:String,default:""}
});

var Status = mongoose.Schema({
    Present: String,
    Absent: String,
    Sick_Leave: String,
    Day_OFF: String
});

mongoose.connect(url);

var Employees = mongoose.model('Employee', Employee);
var User = mongoose.model('User', User);
var Attendance = mongoose.model('Attendance', Attendance); 
var Status = mongoose.model('Status', Status);    

    
  

app.get('/', function (req, res) {
  res.send('Welcome To eSEED')
})

app.get('/home', function (req, res) {
  
      res.sendFile('html/home.html', {root: __dirname })
})

app.post('/login', function(req, res) {
    console.log(req.body.email + req.body.password)
    User.find({"Email":req.body.email,"Password": req.body.password},function(err,user){
        if(err){
            console.log(err.message);
        }
        else if(user.length == 0){
            alert("Please check your Email or Password!");
        }
        else{
            res.sendFile('html/loggedIn.html', {root: __dirname });
        }
    })
})

app.get('/viewAttendance', function(req, res) {
    var attendance =[];
    //console.log(req.body.email + req.body.password)
    Attendance.find({"Employee":req.body.name},function(err,user){
        if(err){
            console.log(err.message);
        }
        else{
            for(let i =0; i<employee.length; i++){
                obj = {"Day":user[i].Day,"Working_hours":user[i].Working_hours,"Employee":user[i].Employee,"Status":user[i].Employee};
                attendance.push(obj);
                //document.getElementById("name").innerHTML = employee[i].Email;
            }
             
            res.status("201").json({Attendance:attendance});
            attendance =[];
        }
    })
})
app.post('/getEmployee', function(req, res) {
    var employees = [],obj;
    Employees.find({},"Email Name Mobile_no HireDate",function(err,employee){
                    
        if(err){
            console.log(err.message);
        }
        else
        {
            for(let i =0; i<employee.length; i++){
                obj = {"Email":employee[i].Email,"Name":employee[i].Name,"Mobile_no":employee[i].Mobile_no,"HireDate":employee[i].HireDate};
                employees.push(obj);
                //document.getElementById("name").innerHTML = employee[i].Email;
            }
             
            res.status("201").json({employees:employees});
            console.log("///////////" + employees);
            employees =[];
        }
    })
    
})


app.get('/addEmployee', function(req, res) {
    res.sendFile('html/addEmployee.html', {root: __dirname })
})
 
 app.post('/addEmployee', function(req, res) {
    var employee = new Employees({
        Name: req.body.name,
        Mobile_no: req.body.phone,
        Email: req.body.email,
        HireDate: new Date()
    })
    employee.save(function(err,saved){
        if(err){
            console.log(err.message);
        }
        else{
            if(req.body.name == "" || req.body.phone == "" || req.body.email == ""){
                alert("all fileds must be filled")
            }
            else{
                res.send("Saved Successfully");
            }
            
        }
    })
    
 })
 
 app.post('/attendance', function(req, res) {
    var attendances = new Attendance({
        Employee: req.body.Employee,
        Working_hours: req.body.Working_hours,
        Status: req.body.Status,
        Day: new Date()
    })
    attendances.save(function(err,saved){
        if(err){
            console.log(err.message);
        }
        else{
            res.send("Saved Successfully");
        }
    })
    
 })
 


app.post('/deleteEmployee', function(req, res) {
    console.log("----------->" + req.body.email)
    Employees.findOne({"Email":req.body.email},"_id",function(err,employee){
                    
        if(err){
            console.log(err.message);
        }
        else
        {
           Employees.findByIdAndRemove({"_id":employee._id},function(err,deleted){
            if(err){
                console.log(err.message);
            }
            else
            {
                res.send("Deleted successfully");
            }
           })
        }
    })
    
})

app.post('/signup', function(req, res) {
    var user = new User({
        Name: req.body.name,
        Email: req.body.Email,
        Password: req.body.password
    })
    user.save(function(err,saved){
        if(err){
            console.log(err.message);
        }
        else{
            var employee = new Employees({
                Name: req.body.name,
                Mobile_no: req.body.phone,
                Email: req.body.email,
                HireDate: new Date()
            })
            employee.save(function(err,saved){
                if(err){
                    console.log(err.message);
                }
                else{
                    res.send("Saved Successfully");
                }
            })
        }
    })
    
})

app.post('/editEmployee', function(req, res) {
    Employees.findOne({"Email":req.body.email},"_id",function(err,employee){                    
        if(err){
            console.log(err.message);
        }
        else
        {
           Employees.findByIdAndUpdate({"_id":employee._id},{"Status":"edit"},function(err,updated){
                if(err){
                    console.log(err.message);
                }
                else
                {
                    res.sendFile('html/editInfo.html', {root: __dirname });
                }
           })
        }
    })
})

app.get('/editEmployee', function(req, res) {
    Employees.findOne({"Status":"edit"},"_id",function(err,employee){                    
        if(err){
            console.log(err.message);
        }
        else
        {
           name = req.body.name;
           email = req.body.email;
           phone = req.body.phone;
           Employees.findByIdAndUpdate({"_id":employee._id},{"Name":name,"Mobile_no":phone,"Email":email},function(err,deleted){
                if(err){
                    console.log(err.message);
                }
                else
                {
                    res.send("Updated successfully");
                }
           })
        }
    })
    
})


 
app.get('/getEmployees', function(req, res) {
        res.sendFile('html/getEmployees.html', {root: __dirname })
     })

app.get('/ride.html', function(req, res) {
        res.sendFile('html/ride.html', {root: __dirname })
     })



    app.listen(5000, function() {
        console.log("Server is running on 5000 !");
     });

//nodemon ./test.js localhost 8000
import React, { useState } from "react";
import { useHistory } from "react-router";
import db from "../database/db";
import * as firebase from 'firebase';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';

const categoryPathName = {
    "stories": "Story",
    "poems": "Poem",
    "quotes": "Quote",
    "articles": "Article",
    "fanfiction": "Fanfiction",
    "audio": "Audio",
    "scripts": "Script"
};

export function TopUserTile(myprops) {
    const history = useHistory();
    console.log("hey dude")
    const [fstatus, setFstatus] = useState(myprops.follows.includes(myprops.uobj[1]));

    function SetFollows() {
        if (fstatus) {


            db.firestore().collection("users").doc(localStorage.getItem('username')).update(
                {
                    "nfollows": firebase.firestore.FieldValue.increment(-1)
                }
            );
            db.firestore().collection("users").doc(myprops.uobj[1]).update({
                "nfollowers": firebase.firestore.FieldValue.increment(-1)
            })

            db.firestore().collection("follows").doc(localStorage.getItem('username')).update({
                follows: firebase.firestore.FieldValue.arrayRemove(myprops.uobj[1])
            });
            db.firestore().collection("followers").doc(myprops.uobj[1]).update({
                followers: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('username'))
            });

        } else {



            db.firestore().collection("users").doc(localStorage.getItem('username')).update(
                {
                    "nfollows": firebase.firestore.FieldValue.increment(1)
                }
            );
            db.firestore().collection("users").doc(myprops.uobj[1]).update({
                "nfollowers": firebase.firestore.FieldValue.increment(1)
            })

            db.firestore().collection("follows").doc(localStorage.getItem('username')).update({
                follows: firebase.firestore.FieldValue.arrayUnion(myprops.uobj[1])
            });
            db.firestore().collection("followers").doc(myprops.uobj[1]).update({
                followers: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('username'))
            });
        }
        setFstatus(!fstatus);
    }

    return <div style={{ display: "flex", justifyContent: "space-between", borderColor: "grey", borderStyle: "solid", borderWidth: "0px", borderTop: "0px", borderLeft: "0px", borderRight: "0px" }}>
        <div style={{ height: "30px", width: "30px", borderRadius: "50%", margin: "5px", backgroundColor: "white" }}>
            <img alt="profile-pic small" style={{ height: "30px", width: "30px", borderRadius: "50%" }} src={myprops.uobj[0].profileimg ? myprops.uobj[0].profileimg : process.env.PUBLIC_URL + '/usericon.png'} />
        </div>
        <a href="" className="tcreator-tile-a" onClick={() => history.push({
            pathname: '/Profile',
            search: '?UserId=' + myprops.uobj[1],
            state: { id: myprops.uobj[1] },
        })}>
            <p style={{ marginTop: "10px", marginLeft: "5px" }}>{myprops.uobj[1]}</p>
        </a>
        {myprops.uobj[1] === localStorage.getItem("username") ? <i></i> : <a className="pointer" onClick={() => { SetFollows() }} ><i style={{ marginTop: "10px", marginLeft: "5px", color: fstatus ? "green" : "blue" }} className={fstatus ? "fas fa-user-check" : "fa fa-user-plus"}></i></a>}
    </div>
}




export class TopCreators extends React.Component {

    constructor(props) {
        super(props);
        this.state = { topusers: [], ids: "", follows: [], fcheck: 0 }
    }

    shouldComponentUpdate(NextProps, NextState) {
        if (this.props === NextProps && NextState.ids === this.state.ids && NextState.fcheck === this.state.fcheck) {
            return false;
        }
        return true;
    }

    render() {

        var tusers = [];
        var ids = "";
        var follows = [];
        db.firestore().collection("follows").doc(localStorage.getItem("username")).get().then((snapshot) => {
            follows = snapshot.data().follows;

            this.setState({ follows: follows, fcheck: 2 });
        });

        db.firestore().collection("users").orderBy("nfollowers", "desc").limit(7).get().then((snapshot) => {

            snapshot.forEach((doc) => {
                ids += doc.id;
                tusers.push([doc.data(), doc.id]);
            });

            this.setState({ topusers: tusers, ids: ids });
        })

        return <div><div className="topcreators-title" style={{ marginLeft: "-9%", height: "40px", width: "140%", backgroundColor: "#f5ba13" }}>
            <p className="tcreators-head" align="center">CREATORS ON THE RISE</p>
        </div>
            <div style={{ marginLeft: "-9%", width: "140%" }}>
                {this.state.topusers.length === 0
                    ?
                    <div className="container">
                        <img align="center" alt="loading" style={{ marginLeft: "70px", marginTop: "40px", height: "40px", width: "auto" }} src={process.env.PUBLIC_URL + '/ripple-nobg.gif'} />
                    </div>
                    :

                    this.state.topusers.map((data) => { return <TopUserTile uobj={data} key={data[1]} follows={this.state.follows} /> })

                }

            </div>
        </div>
    }
}




function ResultTab(myprops) {
    const history = useHistory();
    return <div className="container search-result-tab pointer" style={{ padding: "20px", height: "auto" }} onClick={() => {
        history.push({
            pathname: '/ReadStory',
            search: "?title=" + myprops.cobj[2] + "&StoryId=" + myprops.cobj[1],
            state: {
                title: myprops.cobj[2],
                id: myprops.cobj[1],
            }
        })
    }}>
        <div className="col-sm-3">
            <img className="sm-cover" style={{ backgroundColor: "white" }} alt="search result cover" src={myprops.cobj[0].coverid && myprops.cobj[0].coverid !== "" ? myprops.cobj[0].coverid : process.env.PUBLIC_URL + '/ScribbleBow.png'} />
        </div>
        <div className="col-sm-9" >
            <div style={{ height: "180px", width: "90%" }}>
                {myprops.cobj[0].title ? <h2>{myprops.cobj[0].title}</h2> : null}
                <p>{myprops.cobj[0].creator}</p>
                <p><i className="fa fa-heart" style={{ color: "red" }}></i> {myprops.cobj[0].nlikes} <i className='fas fa-comment-alt' style={{ color: "blue" }}></i> {myprops.cobj[0].ncomments} </p>
                <hr />
                {myprops.cobj[0].type ? <p>{myprops.cobj[0].type}</p> : null}
                {myprops.cobj[0].basedOn ? <p>Based on: {myprops.cobj[0].basedOn}</p> : null}
                {myprops.cobj[0].genre ? <p className="btn btn-sm" style={{ backgroundColor: "purple", color: "white", marginBottom: "2px", marginTop: "-20px", padding: "2px" }}>{myprops.cobj[0].genre}</p> : null}
                {myprops.cobj[0].description ? <p>{myprops.cobj[0].description.length > 40 ? myprops.cobj[0].description.substring(0, 40) + "..." : myprops.cobj[0].description}</p> : null}
            </div>
        </div>
    </div>
}



function ResultUserTab(myprops) {
    const [fstatus, setFstatus] = useState(myprops.follows.includes(myprops.cobj[1]));
    const [fno, setFno] = useState(myprops.cobj[0].nfollowers);
    const history = useHistory();


    function SetFollows() {
        if (fstatus) {


            db.firestore().collection("users").doc(localStorage.getItem('username')).update(
                {
                    "nfollows": firebase.firestore.FieldValue.increment(-1)
                }
            );
            db.firestore().collection("users").doc(myprops.cobj[1]).update({
                "nfollowers": firebase.firestore.FieldValue.increment(-1)
            })

            db.firestore().collection("follows").doc(localStorage.getItem('username')).update({
                follows: firebase.firestore.FieldValue.arrayRemove(myprops.cobj[1])
            });
            db.firestore().collection("followers").doc(myprops.cobj[1]).update({
                followers: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('username'))
            });

            setFno(fno - 1);

        } else {



            db.firestore().collection("users").doc(localStorage.getItem('username')).update(
                {
                    "nfollows": firebase.firestore.FieldValue.increment(1)
                }
            );
            db.firestore().collection("users").doc(myprops.cobj[1]).update({
                "nfollowers": firebase.firestore.FieldValue.increment(1)
            })

            db.firestore().collection("follows").doc(localStorage.getItem('username')).update({
                follows: firebase.firestore.FieldValue.arrayUnion(myprops.cobj[1])
            });
            db.firestore().collection("followers").doc(myprops.cobj[1]).update({
                followers: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('username'))
            });
            setFno(fno + 1);
        }
        setFstatus(!fstatus);

    }


    return <div className="container search-result-tab pointer" style={{ padding: "20px", height: "auto" }} onClick={() => {
        history.push({
            pathname: '/Profile',
            search: '?UserId=' + myprops.cobj[1],
            state: { id: myprops.cobj[1] },
        })
    }}>
        <div className="col-sm-2">
            <img style={{ backgroundColor: "white", height: "80px", width: "80px", borderRadius: "50%" }} alt="search result cover" src={myprops.cobj[0].profileimg && myprops.cobj[0].profileimg !== "" ? myprops.cobj[0].profileimg : process.env.PUBLIC_URL + '/ScribbleBow.png'} />
        </div>
        <div className="col-sm-4" >
            <div style={{ height: "auto", width: "90%" }}>
                <h4>{myprops.cobj[0].fname ? myprops.cobj[0].fname + " " + myprops.cobj[0].lname : null}</h4>
                <p>{myprops.cobj[1]}</p>
            </div>
        </div>
        <div className="col-sm-2" >
            <div style={{ height: "auto", width: "90%" }}>
                <p><i className="fa fa-users" aria-hidden="true" style={{ color: "blue" }}></i>{" " + fno}</p>
                <p><i className='fas fa-pencil-alt' style={{ color: "blue" }}></i>{" " + (myprops.cobj[0].stories + myprops.cobj[0].poems + myprops.cobj[0].quotes + myprops.cobj[0].articles + myprops.cobj[0].fanfiction + myprops.cobj[0].audio + myprops.cobj[0].scripts)}</p>
            </div>
        </div>
        <div className="col-sm-4" >
            <div style={{ height: "auto", width: "90%" }}>

                {myprops.cobj[1] === localStorage.getItem("username") ? <i></i> : <button className={fstatus ? "btn fbtn2" : "btn fbtn"} style={{width:"50%"}} onClick={(event) => { event.stopPropagation(); SetFollows(); }} >{fstatus ? "Following" : "Follow"}</button>}

            </div>
        </div>
    </div>
}




class RetrieveSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { retrieved: [], ids: "", k: 0, sswitch: false, fcheck: 0 };
    }

    shouldComponentUpdate(NextProps, NextState) {

        if (this.props === NextProps && this.state.ids === NextState.ids && this.state.k === NextState.k && this.state.sswitch === NextState.sswitch && this.state.fcheck === NextState.fcheck) {
            return false;
        }
        return true;
    }


    Switch = () => {
        return <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Content</Grid>
            <Grid item>
                <Switch size="small" checked={this.state.sswitch} onChange={() => { this.setState({ retrieved: [], sswitch: !this.state.sswitch, k: 0 }); }} color="primary" /></Grid>
            <Grid item>Creators</Grid>
        </Grid>
    }
    render() {
        console.log("doing")
        var res = [];
        var ids = "";

        if (this.props.searchkey.length === 0) {
            return <div style={{ padding: "20px" }}>
                <p>You might have entered insufficient input</p>
            </div>
        }
        else {
            if (this.state.sswitch === false) {
                if (this.props.category === "nocat") {
                    var l = ["poems", "quotes", "audio", "scripts", "articles", "fanfiction", "stories"]
                    var c = 0;
                    l.forEach(element => {
                        var hash;
                        if(this.props.hash){
                            hash = 'hashtags'
                        }else{
                            hash = 'titlekeys'
                        }
                        db.firestore().collection(element).where("published", "==", true).where(hash, 'array-contains-any',
                            this.props.searchkey).limit(4).get()
                            .then(snapshot => {

                                if (!snapshot.length)
                                    this.setState({ k: 2 });
                                snapshot.forEach((doc) => {
                                    const d = [doc.data(), doc.id,categoryPathName[element]];
                                    const id = doc.id;

                                    ids = ids + id;


                                    res.push(d);


                                })
                                c += 1;
                                if (c === 7)
                                    this.setState({ retrieved: res, ids: ids });

                            });
                    });
                }
                else {
                    var hash;
                        if(this.props.hash){
                            hash = 'hashtags'
                        }else{
                            hash = 'titlekeys'
                        }
                    db.firestore().collection(this.props.category).where("published", '==', true).where(hash, 'array-contains-any',
                        this.props.searchkey).limit(20).get().then(snapshot => {

                            if (!snapshot.length)
                                this.setState({ k: 2 });
                            snapshot.forEach((doc) => {
                                const d = [doc.data(), doc.id,categoryPathName[this.props.category]];
                                const id = doc.id;

                                ids = ids + id;


                                res.push(d);


                            })



                            this.setState({ retrieved: res, ids: ids });

                        });
                }

            } else {
                var follows = [];
                db.firestore().collection("follows").doc(localStorage.getItem("username")).get().then((snapshot) => {
                    follows = snapshot.data().follows;

                    this.setState({ follows: follows, fcheck: 2 });
                });

                var dbref;
                if (this.props.category === "nocat")
                    dbref = db.firestore().collection("users");
                else
                    dbref = db.firestore().collection("users").where(this.props.category, ">", 0);
                dbref.where('userkeys', 'array-contains-any',
                    this.props.searchkey).limit(20).get().then(snapshot => {

                        if (!snapshot.length)
                            this.setState({ k: 2 });
                        snapshot.forEach((doc) => {
                            console.log(doc.data())
                            const d = [doc.data(), doc.id];
                            const id = doc.id;

                            ids = ids + id;


                            res.push(d);


                        })



                        this.setState({ retrieved: res, ids: ids });

                    });
            }

            if (this.state.retrieved.length === 0) {
                if (this.state.k === 0) {
                    return <div><this.Switch /><div className="container" align="center"><img align="center" alt="loading" src={process.env.PUBLIC_URL + '/ripple-nobg.gif'} /></div></div>
                } else {
                    return <div>
                        <this.Switch />

                        <p align="center">No results found</p>
                    </div>
                }

            }
            else {
                return <div>
                    <this.Switch />
                    <h2>Search results</h2>
                    {this.state.retrieved.length === 0 ? <p>Empty</p> : this.state.retrieved.map((data) => { return this.state.sswitch ? <ResultUserTab cobj={data} key={data[1]} follows={this.state.follows} category={this.props.category} /> : <ResultTab cobj={data} key={data[1]} category={this.props.category} /> })}
                </div>
            }
        }
    }

}



export function SearchResults(props) {
    var searchkey = props.searchkey.trim();
    var hash = false;
    if (searchkey[0] === "#") {
        searchkey = searchkey.replace(/ /g, "");
        searchkey =[searchkey.substring(1)];
        hash = true;
    } else {
        searchkey = searchkey.split(" ");
        searchkey = searchkey.filter(i => i !== "the");
    }

    if (props.category) {

        return <div className="container" style={{ width: "90%" }}>
            <div className="myscroller-notrack" style={{ height: "80vh", overflowY: "scroll", paddingBottom: "200px", position: "relative" }}>
                <RetrieveSearch category={props.category} searchkey={searchkey} hash = {hash} key={props.category + searchkey} />
            </div></div>
    } else {
        return <div className="container" style={{ width: "90%" }}>
            <div className="myscroller-notrack" style={{ height: "80vh", overflowY: "scroll", paddingBottom: "200px", position: "relative" }}>
                <RetrieveSearch category={"nocat"} searchkey={searchkey} hash = {hash} key={props.category + searchkey} />
            </div></div>
    }


}
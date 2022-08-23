import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { loadProxy } from '../misc/storage';
import {updateHashmap} from 'src/api/hashmaps';
import {closeConnections} from 'src/api/connections';

export default function FormDialog({showtext, apiconfig, ID, toggleIsRefreshPaused}) {
    const [open, setOpen] = React.useState(false);
    const [proxy, setProxy] = React.useState('DIRECT');
    const proxyList = loadProxy();
    const [domain, setDomain] = React.useState(showtext.toString().split(":")[0] ? showtext.toString().split(":")[0] : showtext);
    const [type, setType] = React.useState('DOMAIN-SUFFIX');

    const handleClickOpen = () => {
        setOpen(true);
        toggleIsRefreshPaused(true);
    };

    const handleClose = () => {
        setOpen(false);
        toggleIsRefreshPaused(false);
    };

    const handleSubmit = () => {
        updateHashmap(apiconfig, {key: domain, proxyName: proxy, tp:type})
        closeConnections(apiconfig, ID.toString())
        setOpen(false);
        toggleIsRefreshPaused(false);
    };

    const handleDKChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        console.log(event.target.value)
        setDomain(event.target.value as string)
        // updateHashmap(apiconfig, {key: hashkey, proxyName: value})
    };

    const handleProxyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        console.log("handleProxyChange", event.target.value)
        setProxy(event.target.value as string)
        // updateHashmap(apiconfig, {key: hashkey, proxyName: value})
    };

    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        console.log("handleTypeChange", event.target.value)
        setType(event.target.value as string)
        // updateHashmap(apiconfig, {key: hashkey, proxyName: value})
    };

    return (
        <div>
            <Button variant="text" onClick={handleClickOpen} color={'inherit'}>
                {showtext}
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> Build a new rule With DomainKeyword</DialogTitle>
                <DialogContent>
                    <Select autoFocus id="type" onChange={handleTypeChange} fullWidth defaultValue={type}>
                        <MenuItem value="DOMAIN">DOMAIN</MenuItem>
                        <MenuItem value="DOMAIN-SUFFIX">DOMAIN-SUFFIX</MenuItem>
                        <MenuItem value="DOMAIN-KEYWORD">DOMAIN-KEYWORD</MenuItem>
                        <MenuItem value="IP-CIDR">IP-CIDR</MenuItem>
                        <MenuItem value="SRC-IP-CIDR">SRC-IP-CIDR</MenuItem>
                        <MenuItem value="SRC-PORT">SRC-PORT</MenuItem>
                        <MenuItem value="DST-PORT">DST-PORT</MenuItem>
                        <MenuItem value="PROCESS-NAME">PROCESS-NAME</MenuItem>
                        <MenuItem value="MATCH">MATCH</MenuItem>
                        <MenuItem value="ALLIP">ALLIP</MenuItem>
                    </Select>
                    <TextField autoFocus margin="dense" id="DomainKeyword" label="DomainKeyword" defaultValue={domain}
                               onChange={handleDKChange} fullWidth/>
                    <Select autoFocus id="proxy" onChange={handleProxyChange} fullWidth defaultValue="DIRECT">
                        {
                            Object.keys(proxyList.providers).map((value, index)=>{
                                return <MenuItem value={value}>{value}</MenuItem>
                            })
                        }
                        <MenuItem value="DIRECT">DIRECT</MenuItem>
                        <MenuItem value="REJECT">REJECT</MenuItem>
                        <MenuItem value="DELETE">DELETE</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


// const emails = ['DIRECT', 'PROXY'];
// const useStyles = makeStyles({
//     avatar: {
//         backgroundColor: blue[100],
//         color: blue[600],
//     },
// });

// function SimpleDialog({onClose, open, selectedValue, apiconfig, hashkey}) {
//     // const classes = useStyles();
//     // const { onClose, selectedValue, open } = props;
//
//     const handleClose = () => {
//         onClose(selectedValue);
//     };
//
//     const handleListItemClick = (value) => {
//         // console.log(value)
//         updateHashmap(apiconfig, {key: hashkey, proxyName: value})
//         onClose(value);
//     };
//
//     return (
//         <Dialog onClose={handleClose} open={open}>
//             <DialogTitle>Set Proxy</DialogTitle>
//             <List>
//                 {emails.map((email) => (
//                     <ListItem button onClick={() => handleListItemClick(email)} key={email}>
//                         <ListItemText primary={email}/>
//                     </ListItem>
//                 ))}
//             </List>
//         </Dialog>
//     );
// };

// SimpleDialog.propTypes = {
//     onClose: PropTypes.func.isRequired,
//     open: PropTypes.bool.isRequired,
//     selectedValue: PropTypes.string.isRequired,
// };


// export default function SimpleDialogDemo({showtext, apiconfig}) {
//     const [open, setOpen] = React.useState(false);
//     const [selectedValue, setSelectedValue] = React.useState(emails[1]);
//     // const { showText } = showtext;
//
//     const handleClickOpen = () => {
//         setOpen(true);
//     };
//
//     const handleClose = (value) => {
//         // console.log(value)
//         setOpen(false);
//         setSelectedValue(value);
//     };
//
//     return (
//         <div>
//             <Button variant={"text"} onClick={handleClickOpen} color={'inherit'}>
//                 {showtext}
//             </Button>
//             <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} apiconfig={apiconfig}
//                           hashkey={showtext}/>
//         </div>
//     );
// };

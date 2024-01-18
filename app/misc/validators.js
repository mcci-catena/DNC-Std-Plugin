/*############################################################################
# 
# Module: validators.js
#
# Description:
#     Validates the input parameter sent from Plugin 
#
# Copyright notice:
#     This file copyright (c) 2021 by
#
#         MCCI Corporation
#         3520 Krums Corners Road
#         Ithaca, NY  14850
#
#     Released under the MCCI Corporation.
#
# Author:
#     Seenivasan V, MCCI Corporation February 2021
#
# Revision history:
#     V1.0.0 Fri Oct 22 2021 11:24:35 seenivasan
#       Module created
############################################################################*/

// The primary purpose of this module is to validate the given time format
// Input parameter - HH:MM:SS
// Response - True if the received time format is valid one
// Response - False if the received time format is invalid one

exports.validatetime = (inputTime) => {

    var timeformat = /^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/; 

    if(inputTime.match(timeformat))
    {
        return true;
    }
    return false;
}

// The primary purpose of this module is to validate the given date format
// Input parameter - MM/DD/YYYY or MM-DD-YYYY
// Response - True if the received time format is valid one
// Response - False if the received time format is invalid one

exports.validatedate = (inputText) => {

    // it works for MM/DD/YYYY or MM-DD-YYYY
    var dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
    
    // Match the date format through regular expression
    if(inputText.match(dateformat))
    {
        //Test which seperator is used '/' or '-'
        var opera1 = inputText.split('/');
        var opera2 = inputText.split('-');
        lopera1 = opera1.length;
        lopera2 = opera2.length;

        // Extract the string into month, date and year
        if (lopera1>1)
        {
            var pdate = inputText.split('/');
        }
        else if (lopera2>1)
        {
            var pdate = inputText.split('-');
        }
        var mm  = parseInt(pdate[0]);
        var dd = parseInt(pdate[1]);
        var yy = parseInt(pdate[2]);
        
        // Create list of days of a month [assume there is no leap year by default]
        var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
        if (mm==1 || mm>2)
        {
            if (dd>ListofDays[mm-1])
            {
                return false;
            }
        }
        if (mm==2)
        {
            var lyear = false;
            if ( (!(yy % 4) && yy % 100) || !(yy % 400) ) 
            {
                lyear = true;
            }
            if ((lyear==false) && (dd>=29))
            {
                return false;
            }
            if ((lyear==true) && (dd>29))
            {
                return false;
            }
        }
        return true;
    }
    else
    {
        return false;
    }
}
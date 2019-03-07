##########################
# HOW TO RUN APPLICATION #
##########################

In order to run this application all you need to do prior is run your own local
Apache webserver and have this folder in the specified directory in your Apache configuration.

#############################
# WHAT THE APPLICATION DOES #
#############################

This application is a single-page AngularJS application, what it does is it loads the mock data 
asynchronously and displays that data using the D3 visualization library in the form of a
stacked bar chart and a pie chart. The stacked bar chart shows per day what amount of time (in minutes) was
spent doing each facet of the application. The first days are mostly just learning days, with some
of the days spent on brainstorming the application. These visualizations are responsive to any screen 
size and also have the added interactivity of tooltips displaying data when hovering.

#################################
# FEATURES IN THE WORKS/DETAILS #
#################################

Since I had to start off learning much of the tools used in creating this project there were some
things that I would have liked to implement but couldn't actually implement or have the time to implement.
-when hovering over data also show time breakdown of time-in/time-out (currently data being unused)
-pre-made color category scales, had to abandon them because they wouldn't display correctly with the legend
-animations to the stacked bar chart, I couldn't figure out how to make them rise sequentially
-Input fields that would add and update data to the pie chart, this was abandoned but the inputs are there just to show the idea
-AJAX to load updated data to the webserver

##########################
#    CLOSING THOUGHTS    #
##########################

Although this was not a complex project because of the situation of teaching myself this new material and
quickly thinking and finding ways of implementing it I ran into many problems along the way. Some of which
could be troubleshooted online but many more of which I had to think through and troubleshoot manually to
think through the problems I was facing. This was a challenging yet fun process however and I feel as though
the skills I have quickly learned in this project will be things I can and will build upon to further my
current skill set in website development.

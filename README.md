# page_testupload
Show an example to upload a file to a case with a REST API


 <img src="screenshot_foodtruck.jpg" />
 
This page show you how to implement a File Upload in your Custom page.

Define a process with a Document variable, and create a case in this process. So, you need to have a the case id and the Document Name. 

upload : then, first upload a new file on the server using ngUpload. The BonitaEngine will return you a temporary file name. 
Assign : the file name is give in the Assign part. Here the tips : firs call, a POST has to be done.
After, to update the content, a PUT has to be done, but with the documentId (which is an internal information), so a first call to get this documentId is necessary.
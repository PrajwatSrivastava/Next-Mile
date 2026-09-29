var fso = new ActiveXObject("Scripting.FileSystemObject");
var f = fso.OpenTextFile(WScript.Arguments(0), 1);
var html = f.ReadAll(); f.Close();
var s = html.indexOf("<" + "script>") + 8;
var e = html.lastIndexOf("<" + "/script>");
var code = html.substring(s, e);
WScript.Echo("script length: " + code.length + " chars");
try { new Function(code); WScript.Echo("PARSE OK"); }
catch (ex) { WScript.Echo("PARSE FAIL -> " + ex.description); }

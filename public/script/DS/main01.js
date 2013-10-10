var L;
$(function(){
	L = Linit();
	L = Ladd(L, 'a', 0);
	print("stdout", "Current list is : "); Lprint(L); print("stdout", "<br />");
	L = Ladd(L, 'b', 0);
	print("stdout", "Current list is : "); Lprint(L); print("stdout", "<br />");
	L = Ldel(L, 5);
	print("stdout", "Current list is : "); Lprint(L); print("stdout", "<br />");
	L = Ladd(L, 'c', 1);
	print("stdout", "Current list is : "); Lprint(L); print("stdout", "<br />");
	L = Ladd(L, 'b', 3);
	print("stdout", "Current list is : "); Lprint(L); print("stdout", "<br />");

	print("stdout", "'b' is at : " + Lmatch(L, 'b') + "<br />");
	L = Ladd(L, 'z', 8);
	print("stdout", "Current list is : "); Lprint(L); print("stdout", "<br />");
	L = Ldel(L, 2);
	print("stdout", "Current list is : "); Lprint(L); print("stdout", "<br />");

	print("stdout", "Element at position 1 is " + Lgetch(L,1) + "<br />");
});
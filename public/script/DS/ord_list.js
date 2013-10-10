// Generated by CoffeeScript 1.6.3
var Ladd, Ldel, Lgetch, Linit, Lmatch, Lprint, Node, OrdList, print;

Node = (function() {
  function Node(data, next) {
    this.data = data != null ? data : null;
    this.next = next != null ? next : null;
  }

  return Node;

})();

OrdList = (function() {
  function OrdList() {
    this.head = new Node();
  }

  return OrdList;

})();

print = function(out, str) {
  return $("#" + out).html($("#" + out).html() + str);
};

Linit = function() {
  return new OrdList();
};

Ladd = function(L, ch, i) {
  var lastNode, now, nowNode;
  now = 0;
  lastNode = L.head;
  nowNode = L.head.next;
  while (nowNode != null) {
    if ((now++) === i) {
      lastNode.next = new Node(ch, nowNode);
      break;
    }
    lastNode = nowNode;
    nowNode = nowNode.next;
  }
  if (now <= i) {
    lastNode.next = new Node(ch, nowNode);
  }
  return L;
};

Ldel = function(L, i) {
  var lastNode, now, nowNode;
  now = 0;
  lastNode = L.head;
  nowNode = L.head.next;
  while (nowNode != null) {
    if ((now++) === i) {
      lastNode.next = nowNode.next;
      break;
    }
    lastNode = nowNode;
    nowNode = nowNode.next;
  }
  if (now <= i) {
    print("stderr", "<br/>Error: 刪除超過Ordered-List長度");
  }
  return L;
};

Lmatch = function(L, ch) {
  var lastNode, now, nowNode;
  now = 0;
  lastNode = L.head;
  nowNode = L.head.next;
  while (nowNode != null) {
    if (nowNode.data === ch) {
      break;
    }
    lastNode = nowNode;
    nowNode = nowNode.next;
    ++now;
  }
  if (nowNode != null) {
    return now;
  } else {
    print("stderr", "<br/>Error: 未找到" + ch);
    return -1;
  }
};

Lgetch = function(L, i) {
  var lastNode, now, nowNode;
  now = 0;
  lastNode = L.head;
  nowNode = L.head.next;
  while (nowNode != null) {
    if ((now++) === i) {
      return nowNode.data;
    }
    lastNode = nowNode;
    nowNode = nowNode.next;
  }
  print("stderr", "<br/>Error: 索引超過Ordered-List長度");
  return "\0";
};

Lprint = function(L) {
  var nowNode;
  nowNode = L.head.next;
  while (nowNode != null) {
    print("stdout", ' ' + nowNode.data);
    nowNode = nowNode.next;
  }
  return true;
};
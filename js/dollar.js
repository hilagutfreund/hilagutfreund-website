/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 *	Andrew D. Wilson, Ph.D.
 *	Microsoft Research
 *	One Microsoft Way
 *	Redmond, WA 98052
 *	awilson@microsoft.com
 *
 *	Yang Li, Ph.D.
 *	Department of Computer Science and Engineering
 * 	University of Washington
 *	Seattle, WA 98195-2840
 * 	yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be 
 * used to cite it, is:
 *
 *	Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without 
 *	  libraries, toolkits or training: A $1 recognizer for user interface 
 *	  prototypes. Proceedings of the ACM Symposium on User Interface 
 *	  Software and Technology (UIST '07). Newport, Rhode Island (October 
 *	  7-10, 2007). New York: ACM Press, pp. 159-168.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed 
 * here by Jacob O. Wobbrock:
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture
 *	  recognizer. Proceedings of the ACM Conference on Human
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// DollarRecognizer class constants
//
var NumUnistrokes = 10;
var NumPoints = 64;
var SquareSize = 250.0;
var Origin = new Point(0,0);
var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
var HalfDiagonal = 0.5 * Diagonal;
var AngleRange = Deg2Rad(45.0);
var AnglePrecision = Deg2Rad(2.0);
var Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array(NumUnistrokes);
	// this.Unistrokes[0] = new Unistroke("triangle", new Array(new Point(137,139),new Point(135,141),new Point(133,144),new Point(132,146),new Point(130,149),new Point(128,151),new Point(126,155),new Point(123,160),new Point(120,166),new Point(116,171),new Point(112,177),new Point(107,183),new Point(102,188),new Point(100,191),new Point(95,195),new Point(90,199),new Point(86,203),new Point(82,206),new Point(80,209),new Point(75,213),new Point(73,213),new Point(70,216),new Point(67,219),new Point(64,221),new Point(61,223),new Point(60,225),new Point(62,226),new Point(65,225),new Point(67,226),new Point(74,226),new Point(77,227),new Point(85,229),new Point(91,230),new Point(99,231),new Point(108,232),new Point(116,233),new Point(125,233),new Point(134,234),new Point(145,233),new Point(153,232),new Point(160,233),new Point(170,234),new Point(177,235),new Point(179,236),new Point(186,237),new Point(193,238),new Point(198,239),new Point(200,237),new Point(202,239),new Point(204,238),new Point(206,234),new Point(205,230),new Point(202,222),new Point(197,216),new Point(192,207),new Point(186,198),new Point(179,189),new Point(174,183),new Point(170,178),new Point(164,171),new Point(161,168),new Point(154,160),new Point(148,155),new Point(143,150),new Point(138,148),new Point(136,148)));
	// this.Unistrokes[1] = new Unistroke("x", new Array(new Point(87,142),new Point(89,145),new Point(91,148),new Point(93,151),new Point(96,155),new Point(98,157),new Point(100,160),new Point(102,162),new Point(106,167),new Point(108,169),new Point(110,171),new Point(115,177),new Point(119,183),new Point(123,189),new Point(127,193),new Point(129,196),new Point(133,200),new Point(137,206),new Point(140,209),new Point(143,212),new Point(146,215),new Point(151,220),new Point(153,222),new Point(155,223),new Point(157,225),new Point(158,223),new Point(157,218),new Point(155,211),new Point(154,208),new Point(152,200),new Point(150,189),new Point(148,179),new Point(147,170),new Point(147,158),new Point(147,148),new Point(147,141),new Point(147,136),new Point(144,135),new Point(142,137),new Point(140,139),new Point(135,145),new Point(131,152),new Point(124,163),new Point(116,177),new Point(108,191),new Point(100,206),new Point(94,217),new Point(91,222),new Point(89,225),new Point(87,226),new Point(87,224)));
	// this.Unistrokes[2] = new Unistroke("rectangle", new Array(new Point(78,149),new Point(78,153),new Point(78,157),new Point(78,160),new Point(79,162),new Point(79,164),new Point(79,167),new Point(79,169),new Point(79,173),new Point(79,178),new Point(79,183),new Point(80,189),new Point(80,193),new Point(80,198),new Point(80,202),new Point(81,208),new Point(81,210),new Point(81,216),new Point(82,222),new Point(82,224),new Point(82,227),new Point(83,229),new Point(83,231),new Point(85,230),new Point(88,232),new Point(90,233),new Point(92,232),new Point(94,233),new Point(99,232),new Point(102,233),new Point(106,233),new Point(109,234),new Point(117,235),new Point(123,236),new Point(126,236),new Point(135,237),new Point(142,238),new Point(145,238),new Point(152,238),new Point(154,239),new Point(165,238),new Point(174,237),new Point(179,236),new Point(186,235),new Point(191,235),new Point(195,233),new Point(197,233),new Point(200,233),new Point(201,235),new Point(201,233),new Point(199,231),new Point(198,226),new Point(198,220),new Point(196,207),new Point(195,195),new Point(195,181),new Point(195,173),new Point(195,163),new Point(194,155),new Point(192,145),new Point(192,143),new Point(192,138),new Point(191,135),new Point(191,133),new Point(191,130),new Point(190,128),new Point(188,129),new Point(186,129),new Point(181,132),new Point(173,131),new Point(162,131),new Point(151,132),new Point(149,132),new Point(138,132),new Point(136,132),new Point(122,131),new Point(120,131),new Point(109,130),new Point(107,130),new Point(90,132),new Point(81,133),new Point(76,133)));
	// this.Unistrokes[3] = new Unistroke("circle", new Array(new Point(127,141),new Point(124,140),new Point(120,139),new Point(118,139),new Point(116,139),new Point(111,140),new Point(109,141),new Point(104,144),new Point(100,147),new Point(96,152),new Point(93,157),new Point(90,163),new Point(87,169),new Point(85,175),new Point(83,181),new Point(82,190),new Point(82,195),new Point(83,200),new Point(84,205),new Point(88,213),new Point(91,216),new Point(96,219),new Point(103,222),new Point(108,224),new Point(111,224),new Point(120,224),new Point(133,223),new Point(142,222),new Point(152,218),new Point(160,214),new Point(167,210),new Point(173,204),new Point(178,198),new Point(179,196),new Point(182,188),new Point(182,177),new Point(178,167),new Point(170,150),new Point(163,138),new Point(152,130),new Point(143,129),new Point(140,131),new Point(129,136),new Point(126,139)));
	// this.Unistrokes[4] = new Unistroke("check", new Array(new Point(91,185),new Point(93,185),new Point(95,185),new Point(97,185),new Point(100,188),new Point(102,189),new Point(104,190),new Point(106,193),new Point(108,195),new Point(110,198),new Point(112,201),new Point(114,204),new Point(115,207),new Point(117,210),new Point(118,212),new Point(120,214),new Point(121,217),new Point(122,219),new Point(123,222),new Point(124,224),new Point(126,226),new Point(127,229),new Point(129,231),new Point(130,233),new Point(129,231),new Point(129,228),new Point(129,226),new Point(129,224),new Point(129,221),new Point(129,218),new Point(129,212),new Point(129,208),new Point(130,198),new Point(132,189),new Point(134,182),new Point(137,173),new Point(143,164),new Point(147,157),new Point(151,151),new Point(155,144),new Point(161,137),new Point(165,131),new Point(171,122),new Point(174,118),new Point(176,114),new Point(177,112),new Point(177,114),new Point(175,116),new Point(173,118)));
	// this.Unistrokes[5] = new Unistroke("caret", new Array(new Point(79,245),new Point(79,242),new Point(79,239),new Point(80,237),new Point(80,234),new Point(81,232),new Point(82,230),new Point(84,224),new Point(86,220),new Point(86,218),new Point(87,216),new Point(88,213),new Point(90,207),new Point(91,202),new Point(92,200),new Point(93,194),new Point(94,192),new Point(96,189),new Point(97,186),new Point(100,179),new Point(102,173),new Point(105,165),new Point(107,160),new Point(109,158),new Point(112,151),new Point(115,144),new Point(117,139),new Point(119,136),new Point(119,134),new Point(120,132),new Point(121,129),new Point(122,127),new Point(124,125),new Point(126,124),new Point(129,125),new Point(131,127),new Point(132,130),new Point(136,139),new Point(141,154),new Point(145,166),new Point(151,182),new Point(156,193),new Point(157,196),new Point(161,209),new Point(162,211),new Point(167,223),new Point(169,229),new Point(170,231),new Point(173,237),new Point(176,242),new Point(177,244),new Point(179,250),new Point(181,255),new Point(182,257)));
	// this.Unistrokes[6] = new Unistroke("zig-zag", new Array(new Point(307,216),new Point(333,186),new Point(356,215),new Point(375,186),new Point(399,216),new Point(418,186)));
	// this.Unistrokes[7] = new Unistroke("arrow", new Array(new Point(68,222),new Point(70,220),new Point(73,218),new Point(75,217),new Point(77,215),new Point(80,213),new Point(82,212),new Point(84,210),new Point(87,209),new Point(89,208),new Point(92,206),new Point(95,204),new Point(101,201),new Point(106,198),new Point(112,194),new Point(118,191),new Point(124,187),new Point(127,186),new Point(132,183),new Point(138,181),new Point(141,180),new Point(146,178),new Point(154,173),new Point(159,171),new Point(161,170),new Point(166,167),new Point(168,167),new Point(171,166),new Point(174,164),new Point(177,162),new Point(180,160),new Point(182,158),new Point(183,156),new Point(181,154),new Point(178,153),new Point(171,153),new Point(164,153),new Point(160,153),new Point(150,154),new Point(147,155),new Point(141,157),new Point(137,158),new Point(135,158),new Point(137,158),new Point(140,157),new Point(143,156),new Point(151,154),new Point(160,152),new Point(170,149),new Point(179,147),new Point(185,145),new Point(192,144),new Point(196,144),new Point(198,144),new Point(200,144),new Point(201,147),new Point(199,149),new Point(194,157),new Point(191,160),new Point(186,167),new Point(180,176),new Point(177,179),new Point(171,187),new Point(169,189),new Point(165,194),new Point(164,196)));
	// this.Unistrokes[8] = new Unistroke("left square bracket", new Array(new Point(140,124),new Point(138,123),new Point(135,122),new Point(133,123),new Point(130,123),new Point(128,124),new Point(125,125),new Point(122,124),new Point(120,124),new Point(118,124),new Point(116,125),new Point(113,125),new Point(111,125),new Point(108,124),new Point(106,125),new Point(104,125),new Point(102,124),new Point(100,123),new Point(98,123),new Point(95,124),new Point(93,123),new Point(90,124),new Point(88,124),new Point(85,125),new Point(83,126),new Point(81,127),new Point(81,129),new Point(82,131),new Point(82,134),new Point(83,138),new Point(84,141),new Point(84,144),new Point(85,148),new Point(85,151),new Point(86,156),new Point(86,160),new Point(86,164),new Point(86,168),new Point(87,171),new Point(87,175),new Point(87,179),new Point(87,182),new Point(87,186),new Point(88,188),new Point(88,195),new Point(88,198),new Point(88,201),new Point(88,207),new Point(89,211),new Point(89,213),new Point(89,217),new Point(89,222),new Point(88,225),new Point(88,229),new Point(88,231),new Point(88,233),new Point(88,235),new Point(89,237),new Point(89,240),new Point(89,242),new Point(91,241),new Point(94,241),new Point(96,240),new Point(98,239),new Point(105,240),new Point(109,240),new Point(113,239),new Point(116,240),new Point(121,239),new Point(130,240),new Point(136,237),new Point(139,237),new Point(144,238),new Point(151,237),new Point(157,236),new Point(159,237)));
	// this.Unistrokes[9] = new Unistroke("right square bracket", new Array(new Point(112,138),new Point(112,136),new Point(115,136),new Point(118,137),new Point(120,136),new Point(123,136),new Point(125,136),new Point(128,136),new Point(131,136),new Point(134,135),new Point(137,135),new Point(140,134),new Point(143,133),new Point(145,132),new Point(147,132),new Point(149,132),new Point(152,132),new Point(153,134),new Point(154,137),new Point(155,141),new Point(156,144),new Point(157,152),new Point(158,161),new Point(160,170),new Point(162,182),new Point(164,192),new Point(166,200),new Point(167,209),new Point(168,214),new Point(168,216),new Point(169,221),new Point(169,223),new Point(169,228),new Point(169,231),new Point(166,233),new Point(164,234),new Point(161,235),new Point(155,236),new Point(147,235),new Point(140,233),new Point(131,233),new Point(124,233),new Point(117,235),new Point(114,238),new Point(112,238)));
	// this.Unistrokes[10] = new Unistroke("v", new Array(new Point(89,164),new Point(90,162),new Point(92,162),new Point(94,164),new Point(95,166),new Point(96,169),new Point(97,171),new Point(99,175),new Point(101,178),new Point(103,182),new Point(106,189),new Point(108,194),new Point(111,199),new Point(114,204),new Point(117,209),new Point(119,214),new Point(122,218),new Point(124,222),new Point(126,225),new Point(128,228),new Point(130,229),new Point(133,233),new Point(134,236),new Point(136,239),new Point(138,240),new Point(139,242),new Point(140,244),new Point(142,242),new Point(142,240),new Point(142,237),new Point(143,235),new Point(143,233),new Point(145,229),new Point(146,226),new Point(148,217),new Point(149,208),new Point(149,205),new Point(151,196),new Point(151,193),new Point(153,182),new Point(155,172),new Point(157,165),new Point(159,160),new Point(162,155),new Point(164,150),new Point(165,148),new Point(166,146)));
	// this.Unistrokes[11] = new Unistroke("delete", new Array(new Point(123,129),new Point(123,131),new Point(124,133),new Point(125,136),new Point(127,140),new Point(129,142),new Point(133,148),new Point(137,154),new Point(143,158),new Point(145,161),new Point(148,164),new Point(153,170),new Point(158,176),new Point(160,178),new Point(164,183),new Point(168,188),new Point(171,191),new Point(175,196),new Point(178,200),new Point(180,202),new Point(181,205),new Point(184,208),new Point(186,210),new Point(187,213),new Point(188,215),new Point(186,212),new Point(183,211),new Point(177,208),new Point(169,206),new Point(162,205),new Point(154,207),new Point(145,209),new Point(137,210),new Point(129,214),new Point(122,217),new Point(118,218),new Point(111,221),new Point(109,222),new Point(110,219),new Point(112,217),new Point(118,209),new Point(120,207),new Point(128,196),new Point(135,187),new Point(138,183),new Point(148,167),new Point(157,153),new Point(163,145),new Point(165,142),new Point(172,133),new Point(177,127),new Point(179,127),new Point(180,125)));
	// this.Unistrokes[12] = new Unistroke("left curly brace", new Array(new Point(150,116),new Point(147,117),new Point(145,116),new Point(142,116),new Point(139,117),new Point(136,117),new Point(133,118),new Point(129,121),new Point(126,122),new Point(123,123),new Point(120,125),new Point(118,127),new Point(115,128),new Point(113,129),new Point(112,131),new Point(113,134),new Point(115,134),new Point(117,135),new Point(120,135),new Point(123,137),new Point(126,138),new Point(129,140),new Point(135,143),new Point(137,144),new Point(139,147),new Point(141,149),new Point(140,152),new Point(139,155),new Point(134,159),new Point(131,161),new Point(124,166),new Point(121,166),new Point(117,166),new Point(114,167),new Point(112,166),new Point(114,164),new Point(116,163),new Point(118,163),new Point(120,162),new Point(122,163),new Point(125,164),new Point(127,165),new Point(129,166),new Point(130,168),new Point(129,171),new Point(127,175),new Point(125,179),new Point(123,184),new Point(121,190),new Point(120,194),new Point(119,199),new Point(120,202),new Point(123,207),new Point(127,211),new Point(133,215),new Point(142,219),new Point(148,220),new Point(151,221)));
	// this.Unistrokes[13] = new Unistroke("right curly brace", new Array(new Point(117,132),new Point(115,132),new Point(115,129),new Point(117,129),new Point(119,128),new Point(122,127),new Point(125,127),new Point(127,127),new Point(130,127),new Point(133,129),new Point(136,129),new Point(138,130),new Point(140,131),new Point(143,134),new Point(144,136),new Point(145,139),new Point(145,142),new Point(145,145),new Point(145,147),new Point(145,149),new Point(144,152),new Point(142,157),new Point(141,160),new Point(139,163),new Point(137,166),new Point(135,167),new Point(133,169),new Point(131,172),new Point(128,173),new Point(126,176),new Point(125,178),new Point(125,180),new Point(125,182),new Point(126,184),new Point(128,187),new Point(130,187),new Point(132,188),new Point(135,189),new Point(140,189),new Point(145,189),new Point(150,187),new Point(155,186),new Point(157,185),new Point(159,184),new Point(156,185),new Point(154,185),new Point(149,185),new Point(145,187),new Point(141,188),new Point(136,191),new Point(134,191),new Point(131,192),new Point(129,193),new Point(129,195),new Point(129,197),new Point(131,200),new Point(133,202),new Point(136,206),new Point(139,211),new Point(142,215),new Point(145,220),new Point(147,225),new Point(148,231),new Point(147,239),new Point(144,244),new Point(139,248),new Point(134,250),new Point(126,253),new Point(119,253),new Point(115,253)));
	// this.Unistrokes[14] = new Unistroke("star", new Array(new Point(75,250),new Point(75,247),new Point(77,244),new Point(78,242),new Point(79,239),new Point(80,237),new Point(82,234),new Point(82,232),new Point(84,229),new Point(85,225),new Point(87,222),new Point(88,219),new Point(89,216),new Point(91,212),new Point(92,208),new Point(94,204),new Point(95,201),new Point(96,196),new Point(97,194),new Point(98,191),new Point(100,185),new Point(102,178),new Point(104,173),new Point(104,171),new Point(105,164),new Point(106,158),new Point(107,156),new Point(107,152),new Point(108,145),new Point(109,141),new Point(110,139),new Point(112,133),new Point(113,131),new Point(116,127),new Point(117,125),new Point(119,122),new Point(121,121),new Point(123,120),new Point(125,122),new Point(125,125),new Point(127,130),new Point(128,133),new Point(131,143),new Point(136,153),new Point(140,163),new Point(144,172),new Point(145,175),new Point(151,189),new Point(156,201),new Point(161,213),new Point(166,225),new Point(169,233),new Point(171,236),new Point(174,243),new Point(177,247),new Point(178,249),new Point(179,251),new Point(180,253),new Point(180,255),new Point(179,257),new Point(177,257),new Point(174,255),new Point(169,250),new Point(164,247),new Point(160,245),new Point(149,238),new Point(138,230),new Point(127,221),new Point(124,220),new Point(112,212),new Point(110,210),new Point(96,201),new Point(84,195),new Point(74,190),new Point(64,182),new Point(55,175),new Point(51,172),new Point(49,170),new Point(51,169),new Point(56,169),new Point(66,169),new Point(78,168),new Point(92,166),new Point(107,164),new Point(123,161),new Point(140,162),new Point(156,162),new Point(171,160),new Point(173,160),new Point(186,160),new Point(195,160),new Point(198,161),new Point(203,163),new Point(208,163),new Point(206,164),new Point(200,167),new Point(187,172),new Point(174,179),new Point(172,181),new Point(153,192),new Point(137,201),new Point(123,211),new Point(112,220),new Point(99,229),new Point(90,237),new Point(80,244),new Point(73,250),new Point(69,254),new Point(69,252)));
	// this.Unistrokes[15] = new Unistroke("pigtail", new Array(new Point(81,219),new Point(84,218),new Point(86,220),new Point(88,220),new Point(90,220),new Point(92,219),new Point(95,220),new Point(97,219),new Point(99,220),new Point(102,218),new Point(105,217),new Point(107,216),new Point(110,216),new Point(113,214),new Point(116,212),new Point(118,210),new Point(121,208),new Point(124,205),new Point(126,202),new Point(129,199),new Point(132,196),new Point(136,191),new Point(139,187),new Point(142,182),new Point(144,179),new Point(146,174),new Point(148,170),new Point(149,168),new Point(151,162),new Point(152,160),new Point(152,157),new Point(152,155),new Point(152,151),new Point(152,149),new Point(152,146),new Point(149,142),new Point(148,139),new Point(145,137),new Point(141,135),new Point(139,135),new Point(134,136),new Point(130,140),new Point(128,142),new Point(126,145),new Point(122,150),new Point(119,158),new Point(117,163),new Point(115,170),new Point(114,175),new Point(117,184),new Point(120,190),new Point(125,199),new Point(129,203),new Point(133,208),new Point(138,213),new Point(145,215),new Point(155,218),new Point(164,219),new Point(166,219),new Point(177,219),new Point(182,218),new Point(192,216),new Point(196,213),new Point(199,212),new Point(201,211)));
	this.Unistrokes[0] = new Unistroke("Play/Pause", [{"X":-95.0452342757273,"Y":1.1368683772161603e-13},{"X":-104.17003262830269,"Y":6.761111135499277},{"X":-109.2590865713789,"Y":20.939577736609976},{"X":-109.9115346107059,"Y":37.57654655488329},{"X":-110.12775433034852,"Y":54.25802220273738},{"X":-109.1495447894101,"Y":70.81831898223379},{"X":-106.92503633948684,"Y":86.73929794212142},{"X":-100.36687467561507,"Y":99.38872597244597},{"X":-92.99786126366388,"Y":110.17056220967402},{"X":-83.68899833169297,"Y":116.48444601045276},{"X":-74.38013539972209,"Y":122.79832981123172},{"X":-64.7538044532181,"Y":127.14304712848866},{"X":-54.78814272658465,"Y":129.38298926062726},{"X":-44.78537525441851,"Y":130.73267283844734},{"X":-34.72873965886495,"Y":130.78992698351362},{"X":-24.672104063311338,"Y":130.8471811285799},{"X":-14.615468467757808,"Y":130.9044352736463},{"X":-4.612368681085968,"Y":129.69682058997114},{"X":5.340747258769454,"Y":127.30825784369586},{"X":15.293863198624877,"Y":124.91969509742034},{"X":24.989507909839062,"Y":120.98717187193017},{"X":34.26714737083449,"Y":114.548024547708},{"X":43.54478683182981,"Y":108.10887722348605},{"X":52.82242629282524,"Y":101.66972989926398},{"X":62.100065753820616,"Y":95.23058257504215},{"X":69.4933599437129,"Y":84.22600337768904},{"X":76.46601419695946,"Y":72.20228877913132},{"X":83.43866845020597,"Y":60.17857418057338},{"X":90.21140477863747,"Y":47.85058681504893},{"X":96.8314616730762,"Y":35.290223118673566},{"X":103.45151856751494,"Y":22.729859422297977},{"X":110.07157546195367,"Y":10.169495725922502},{"X":115.35648800203796,"Y":-3.874725301360172},{"X":119.8382315525377,"Y":-18.81157504647797},{"X":123.1595040086238,"Y":-34.34037447395406},{"X":124.50957685685518,"Y":-50.87467157160171},{"X":123.97610772916403,"Y":-66.79255430915111},{"X":118.9429313778009,"Y":-81.2378475401402},{"X":110.92485780713628,"Y":-90.46041665116644},{"X":101.96325971702572,"Y":-98.03208527770624},{"X":93.00166162691522,"Y":-105.60375390424605},{"X":83.313962033785,"Y":-109.66183704766735},{"X":73.4374812111065,"Y":-112.80641294056278},{"X":63.561000388428,"Y":-115.95098883345827},{"X":53.684519565749554,"Y":-119.0955647263537},{"X":43.6557110207948,"Y":-119.01917040575603},{"X":33.60448818207516,"Y":-118.46882576610875},{"X":23.553265343355577,"Y":-117.91848112646142},{"X":13.502042504635938,"Y":-117.36813648681402},{"X":3.450819665916356,"Y":-116.81779184716669},{"X":-6.600403172803283,"Y":-116.26744720751947},{"X":-16.524840839961314,"Y":-114.23254451684079},{"X":-26.272559418027754,"Y":-110.1283955314218},{"X":-36.02027799609425,"Y":-106.02424654600281},{"X":-45.76799657416072,"Y":-101.92009756058377},{"X":-55.515715152227216,"Y":-97.81594857516484},{"X":-65.26343373029366,"Y":-93.7117995897458},{"X":-74.08650458864429,"Y":-85.73708056298415},{"X":-82.88206524199055,"Y":-77.64720397615878},{"X":-91.67762589533683,"Y":-69.55732738933341},{"X":-100.47318654868312,"Y":-61.46745080250798},{"X":-108.973410592204,"Y":-52.590324722462185},{"X":-117.23191686767441,"Y":-43.06887557487471},{"X":-125.49042314314485,"Y":-33.547426427287235}]); 

	this.Unistrokes[1] = new Unistroke("Mute/Unmute", [{"X":-142.37904881785283,"Y":5.684341886080802e-14},{"X":-132.83196703891971,"Y":-8.670436365600267},{"X":-122.28554745018192,"Y":-16.277177791386492},{"X":-111.69270972382094,"Y":-23.826732471641122},{"X":-101.09031449063441,"Y":-31.364338431569735},{"X":-90.34291527133473,"Y":-38.70407867262858},{"X":-79.1605721005163,"Y":-45.4503145560337},{"X":-67.97822892969786,"Y":-52.19655043943884},{"X":-56.79588575887942,"Y":-58.942786322843986},{"X":-45.613542588060994,"Y":-65.68902220624913},{"X":-34.43119941724254,"Y":-72.43525808965427},{"X":-23.24885624642411,"Y":-79.18149397305942},{"X":-12.066513075605656,"Y":-85.92772985646457},{"X":-0.8841699047871998,"Y":-92.67396573986971},{"X":11.9170246538539,"Y":-95.1478381753331},{"X":24.863998997331777,"Y":-92.58153725763208},{"X":37.4304769820815,"Y":-88.58014198668658},{"X":47.665113748820545,"Y":-80.81596445123773},{"X":50.41629273630133,"Y":-70.3642842920273},{"X":41.449208208835785,"Y":-61.12046255275813},{"X":31.786064876800026,"Y":-52.5569879278233},{"X":21.724746858338335,"Y":-44.38270024676751},{"X":11.775752502015735,"Y":-36.08758622169688},{"X":1.918073772031164,"Y":-27.694244155697504},{"X":-7.939604957953378,"Y":-19.300902089698127},{"X":-17.877762972436727,"Y":-10.99352345075377},{"X":-27.87840373512853,"Y":-2.7528853550593624},{"X":-38.00034157460681,"Y":5.3527393197013},{"X":-48.211700194774835,"Y":13.358831459768254},{"X":-58.85363612984075,"Y":20.846157170762154},{"X":-69.82775076334488,"Y":27.87819671132479},{"X":-75.82299101620909,"Y":31.3092670992788},{"X":-65.33228505483275,"Y":23.633113652765786},{"X":-54.8415790934564,"Y":15.956960206252774},{"X":-45.0452803497129,"Y":7.501649268229073},{"X":-34.89077838894377,"Y":-0.5100677430016276},{"X":-23.708435218125317,"Y":-7.256303626406805},{"X":-12.52609204730689,"Y":-14.002539509811925},{"X":-1.343748876488462,"Y":-20.748775393217073},{"X":10.424510570293336,"Y":-26.354141007033775},{"X":22.943136036802713,"Y":-30.498427080417713},{"X":35.67488134956943,"Y":-29.309924462036122},{"X":48.456798089923154,"Y":-25.97247329245718},{"X":61.01161832369675,"Y":-21.92733655623894},{"X":73.51715730043676,"Y":-17.755001513758714},{"X":85.86231421369686,"Y":-13.168709359438992},{"X":96.3719951090396,"Y":-5.6040512051401095},{"X":105.58132779228973,"Y":3.219751727153408},{"X":107.6209511821472,"Y":14.443877393537576},{"X":103.6914544012379,"Y":26.426180610358813},{"X":97.32215503987746,"Y":37.35090742134261},{"X":90.29240545954102,"Y":47.98935018032327},{"X":82.54387169901085,"Y":58.1369157836765},{"X":74.08046199868753,"Y":67.79627327446721},{"X":65.6170522983642,"Y":77.45563076525787},{"X":56.51668901146908,"Y":86.55871564264288},{"X":47.011274522346866,"Y":95.30805592140092},{"X":37.505860033224735,"Y":104.05739620015896},{"X":27.845673441751273,"Y":112.652610937784},{"X":18.11953849842064,"Y":121.18215282311593},{"X":8.224497587650234,"Y":129.532674466937},{"X":-1.798531718452665,"Y":137.74754363032577},{"X":-11.52217793524369,"Y":146.27958033734075},{"X":-20.95980645507305,"Y":154.8521618246669}]); 

	//this.Unistrokes[2] = new Unistroke("Volume Up", [{"X":-128.43276566067232,"Y":0},{"X":-125.3517940158352,"Y":9.502322681392684},{"X":-122.27082237099808,"Y":19.004645362785254},{"X":-119.18985072616091,"Y":28.506968044177825},{"X":-115.9516475964218,"Y":37.38654593642843},{"X":-111.94754591298116,"Y":43.2326389409244},{"X":-107.94344422954046,"Y":49.0787319454206},{"X":-103.9393425460998,"Y":54.92482494991657},{"X":-99.93524086265913,"Y":60.77091795441277},{"X":-95.63216372705514,"Y":63.7237780542315},{"X":-91.19338076229619,"Y":65.36339130576664},{"X":-86.75459779753717,"Y":67.003004557302},{"X":-82.31581483277819,"Y":68.64261780883692},{"X":-77.87703186801923,"Y":70.28223106037228},{"X":-73.43000640597654,"Y":71.60312836893047},{"X":-68.95755475935854,"Y":71.94086121721932},{"X":-64.48510311274052,"Y":72.27859406550817},{"X":-60.01265146612249,"Y":72.6163269137968},{"X":-55.540199819504494,"Y":72.95405976208565},{"X":-51.067748172886496,"Y":73.2917926103745},{"X":-46.59529652626847,"Y":73.62952545866312},{"X":-42.164119525833115,"Y":72.16276388331573},{"X":-37.74702277088005,"Y":70.08042526961742},{"X":-33.32992601592696,"Y":67.99808665591934},{"X":-28.912829260973865,"Y":65.9157480422208},{"X":-24.495732506020772,"Y":63.83340942852249},{"X":-20.07863575106768,"Y":61.7510708148244},{"X":-15.661538996114587,"Y":59.66873220112609},{"X":-11.244442241161494,"Y":57.58639358742755},{"X":-6.827345486208429,"Y":55.50405497372924},{"X":-2.6869374199139315,"Y":50.60549038887359},{"X":1.4323440119023019,"Y":45.49189216101274},{"X":5.551625443718507,"Y":40.378293933151895},{"X":9.670906875534797,"Y":35.26469570529105},{"X":13.79018830735103,"Y":30.1510974774302},{"X":17.909469739167264,"Y":25.03749924956935},{"X":22.028751170983526,"Y":19.923901021708502},{"X":26.148032602799788,"Y":14.810302793847654},{"X":30.26731403461605,"Y":9.696704565986806},{"X":34.38659546643231,"Y":4.583106338126186},{"X":38.505876898248516,"Y":-0.5304918897347761},{"X":42.62515833006489,"Y":-5.6440901175955105},{"X":46.7444397618811,"Y":-10.757688345456359},{"X":50.49846963398079,"Y":-17.82071018568149},{"X":54.18331872218994,"Y":-25.25296427160231},{"X":57.86816781039914,"Y":-32.68521835752324},{"X":61.553016898608234,"Y":-40.11747244344406},{"X":65.23786598681744,"Y":-47.549726529364875},{"X":68.92271507502659,"Y":-54.98198061528569},{"X":72.60756416323574,"Y":-62.414234701206624},{"X":76.27453111660839,"Y":-69.92137316783601},{"X":79.9216722906242,"Y":-77.51153534627429},{"X":83.56881346464007,"Y":-85.10169752471256},{"X":87.21595463865594,"Y":-92.69185970315073},{"X":90.86309581267176,"Y":-100.282021881589},{"X":94.50100719315816,"Y":-107.90796226260454},{"X":97.98969242835449,"Y":-116.1123601398765},{"X":101.47837766355082,"Y":-124.31675801714835},{"X":104.96706289874714,"Y":-132.5211558944202},{"X":108.45574813394347,"Y":-140.72555377169238},{"X":111.8351439467238,"Y":-149.29638562068556},{"X":115.07917407759174,"Y":-158.32108192756937},{"X":118.32320420845974,"Y":-167.34577823445318},{"X":121.56723433932768,"Y":-176.37047454133676}]); 

	//this.Unistrokes[3] = new Unistroke("Volume Down", [{"X":-148.4774778153373,"Y":0},{"X":-143.47030560740527,"Y":2.7134061364467925},{"X":-138.46313339947324,"Y":5.426812272893585},{"X":-133.4559611915412,"Y":8.140218409340378},{"X":-128.44878898360918,"Y":10.85362454578717},{"X":-123.44161677567713,"Y":13.567030682233963},{"X":-118.43444456774512,"Y":16.28043681868087},{"X":-113.42727235981306,"Y":18.993842955127548},{"X":-108.42010015188106,"Y":21.707249091574454},{"X":-103.412927943949,"Y":24.420655228021246},{"X":-98.40575573601697,"Y":27.13406136446804},{"X":-93.39858352808494,"Y":29.84746750091483},{"X":-88.39141132015291,"Y":32.560873637361624},{"X":-83.38423911222088,"Y":35.27427977380853},{"X":-78.37706690428885,"Y":37.98768591025521},{"X":-73.36989469635682,"Y":40.701092046702115},{"X":-68.36272248842477,"Y":43.41449818314891},{"X":-63.355550280492736,"Y":46.1279043195957},{"X":-58.348378072560735,"Y":48.84131045604249},{"X":-53.34120586462868,"Y":51.55471659248917},{"X":-48.33403365669665,"Y":54.26812272893608},{"X":-43.32686144876459,"Y":56.98152886538287},{"X":-38.31968924083259,"Y":59.69493500182966},{"X":-33.31251703290056,"Y":62.40834113827657},{"X":-28.3053448249685,"Y":65.12174727472325},{"X":-23.230467380871602,"Y":65.7844191769999},{"X":-18.0978572731741,"Y":64.69841761793157},{"X":-12.965247165476569,"Y":63.61241605886323},{"X":-7.832637057779067,"Y":62.526414499794896},{"X":-2.7000269500815364,"Y":61.44041294072656},{"X":2.4329202271394195,"Y":60.362235388253225},{"X":7.566475255688772,"Y":59.298167188515094},{"X":12.700030284238153,"Y":58.234098988776964},{"X":17.833585312787534,"Y":57.17003078903895},{"X":22.96714034133697,"Y":56.105962589300816},{"X":28.100695369886353,"Y":55.041894389562685},{"X":33.05220385770042,"Y":52.49136716560565},{"X":37.73093514327627,"Y":47.7135406354912},{"X":42.40966642885223,"Y":42.93571410537663},{"X":47.08839771442803,"Y":38.15788757526218},{"X":51.76712900000388,"Y":33.38006104514761},{"X":55.894566298523216,"Y":26.724247047949007},{"X":59.787527365827714,"Y":19.269687855103257},{"X":63.68048843313221,"Y":11.815128662257507},{"X":67.57344950043671,"Y":4.36056946941153},{"X":71.4664105677412,"Y":-3.0939897234342197},{"X":74.8509272656716,"Y":-11.583997018316722},{"X":77.91275580459444,"Y":-20.731159474943297},{"X":80.97458434351745,"Y":-29.878321931569985},{"X":83.72670958771033,"Y":-39.44785461983702},{"X":86.07149373253401,"Y":-49.57291499355267},{"X":88.41627787735763,"Y":-59.69797536726833},{"X":90.7610620221813,"Y":-69.82303574098421},{"X":92.99923167256259,"Y":-80.04800187809644},{"X":94.67816484473803,"Y":-90.79701446467664},{"X":96.35709801691331,"Y":-101.54602705125683},{"X":97.83054469307825,"Y":-112.42843221701196},{"X":99.0612038569397,"Y":-123.46844410187691},{"X":100.29186302080126,"Y":-134.50845598674198},{"X":101.5225221846627,"Y":-145.54846787160693},{"X":100.39760574844934,"Y":-156.31296254747815},{"X":98.40247789999756,"Y":-166.7943917384119},{"X":95.46004648765324,"Y":-175.6474865733432},{"X":92.84532867084187,"Y":-184.21558082300015}]); 

	this.Unistrokes[2] = new Unistroke("Volume Up", [{"X":-146.45149447785826,"Y":5.684341886080802e-14},{"X":-137.2439142060939,"Y":4.32039535294831},{"X":-128.0363339343295,"Y":8.640790705896507},{"X":-118.82875366256512,"Y":12.96118605884476},{"X":-109.62117339080075,"Y":17.281581411792956},{"X":-100.41359311903636,"Y":21.60197676474121},{"X":-91.20601284727198,"Y":25.922372117689463},{"X":-82.55206340262107,"Y":31.343017014299278},{"X":-74.9695918645686,"Y":38.8930467284506},{"X":-67.73101517828601,"Y":46.9003590374266},{"X":-59.82420164011285,"Y":53.89568611823893},{"X":-53.626456344679184,"Y":55.25591622159351},{"X":-50.118935058814316,"Y":44.29531188685468},{"X":-48.35061038140623,"Y":32.74585293791813},{"X":-46.58228570399814,"Y":21.196393988981583},{"X":-44.88600700342977,"Y":9.631881434462287},{"X":-43.21618762346944,"Y":-1.9381596477264225},{"X":-42.26573216947145,"Y":-13.590900164038345},{"X":-42.02871228530799,"Y":-25.32565857946821},{"X":-41.92088484346948,"Y":-37.058444249968744},{"X":-42.41284989050263,"Y":-48.782071199031776},{"X":-42.83915241530585,"Y":-60.50924184844689},{"X":-44.69786912416407,"Y":-71.97069239898431},{"X":-46.797213484138325,"Y":-83.42606942289933},{"X":-49.60201381263033,"Y":-94.64316454168397},{"X":-47.95171020520192,"Y":-101.77626245019229},{"X":-38.25969389293911,"Y":-103.83082707135242},{"X":-28.435493449347604,"Y":-104.7351863935246},{"X":-18.53431917477772,"Y":-104.94486154458144},{"X":-8.633144900207839,"Y":-105.15453669563831},{"X":1.185731579318002,"Y":-103.89128050097202},{"X":10.953190006818346,"Y":-101.98076725714748},{"X":20.63470260884759,"Y":-99.51342321681878},{"X":30.121145931381392,"Y":-96.17231648936806},{"X":39.568391103568786,"Y":-92.65331336260888},{"X":49.02839835047911,"Y":-89.18271738046917},{"X":58.51671934068756,"Y":-85.82328358933782},{"X":68.0559187011516,"Y":-82.67805992506251},{"X":77.44696588375939,"Y":-79.0256272130797},{"X":80.10013597391622,"Y":-70.54933284215946},{"X":76.455275512269,"Y":-59.63522860233587},{"X":72.81041505062183,"Y":-48.72112436251231},{"X":70.37002009356326,"Y":-37.35221489524986},{"X":68.01744410937562,"Y":-25.95014505288509},{"X":65.66486812518792,"Y":-14.548075210520295},{"X":63.16776029872443,"Y":-3.190310250951484},{"X":60.56199991160588,"Y":8.134148283614252},{"X":57.88265991480449,"Y":19.434081285854177},{"X":55.12718015786345,"Y":30.70863540722422},{"X":52.39119089949537,"Y":41.98951568031788},{"X":49.916536274911635,"Y":53.35521895256505},{"X":47.186715541437906,"Y":64.62245000374446},{"X":43.541855079790736,"Y":75.53655424356805},{"X":39.896994618143566,"Y":86.45065848339158},{"X":36.25213415649637,"Y":97.36476272321516},{"X":32.607273694849226,"Y":108.27886696303875},{"X":39.09544361979107,"Y":114.60269583372406},{"X":48.303023891555455,"Y":118.92309118667225},{"X":57.51060416331984,"Y":123.24348653962056},{"X":66.71818443508425,"Y":127.56388189256876},{"X":75.92576470684861,"Y":131.88427724551696},{"X":85.13334497861302,"Y":136.20467259846527},{"X":94.34092525037738,"Y":140.52506795141346},{"X":103.54850552214174,"Y":144.84546330436172}]); 

	this.Unistrokes[3] = new Unistroke("Volume Down", [{"X":-144.20548450577724,"Y":-1.1368683772161603e-13},{"X":-135.91633673242313,"Y":-4.320565143867952},{"X":-127.62718895906899,"Y":-8.641130287735848},{"X":-119.33804118571486,"Y":-12.961695431603687},{"X":-111.04889341236071,"Y":-17.282260575471582},{"X":-102.75974563900658,"Y":-21.60282571933942},{"X":-94.47059786565244,"Y":-25.92339086320729},{"X":-86.1814500922983,"Y":-30.243956007075155},{"X":-77.89230231894419,"Y":-34.56452115094302},{"X":-71.5915326673508,"Y":-28.28119614974304},{"X":-66.95306852366821,"Y":-18.205038607876844},{"X":-62.43978327273227,"Y":-8.02877424693446},{"X":-58.20686668773233,"Y":2.3376385861357107},{"X":-54.61778500710351,"Y":13.140705861170716},{"X":-51.0287033264747,"Y":23.943773136205664},{"X":-47.33077970707377,"Y":34.68171675086512},{"X":-43.58926451146425,"Y":45.393578112339185},{"X":-39.22121800070694,"Y":55.67838490663331},{"X":-35.37749092518557,"Y":66.293597095098},{"X":-32.11710503773466,"Y":77.27812597548899},{"X":-28.856719150283737,"Y":88.2626548558801},{"X":-25.596333262832815,"Y":99.2471837362711},{"X":-22.33594737538192,"Y":110.23171261666215},{"X":-16.226166853857308,"Y":114.44144316761691},{"X":-7.937019080503177,"Y":110.12087802374901},{"X":0.35212869285095394,"Y":105.80031287988123},{"X":8.628597340323722,"Y":101.43941647353773},{"X":16.780810514264004,"Y":96.68327356802928},{"X":24.933023688204287,"Y":91.92713066252077},{"X":33.15415043624532,"Y":87.39019620018115},{"X":41.44329820959945,"Y":83.06963105631331},{"X":49.73244598295358,"Y":78.74906591244542},{"X":58.02159375630774,"Y":74.42850076857752},{"X":66.31074152966187,"Y":70.10793562470963},{"X":74.59988930301603,"Y":65.78737048084179},{"X":77.10496962066816,"Y":58.12945710228206},{"X":71.63758061087026,"Y":48.821311597113095},{"X":66.13282822208538,"Y":39.54154636324574},{"X":59.877332869598206,"Y":31.161739762306297},{"X":53.459718284513286,"Y":22.976274780261804},{"X":47.13277290792135,"Y":14.683548184536846},{"X":41.720629772983244,"Y":5.308611141966082},{"X":35.98697521858665,"Y":-3.7123297223129157},{"X":30.023666688017187,"Y":-12.480412911951134},{"X":24.114515699489317,"Y":-21.312530898446795},{"X":17.779275080797873,"Y":-29.58339169713986},{"X":11.400920957481361,"Y":-37.816195149369605},{"X":5.812677585628904,"Y":-46.99834894650263},{"X":-0.0797995364127928,"Y":-55.83932975253231},{"X":-5.626699125087669,"Y":-63.747474511426816},{"X":2.108694804801985,"Y":-68.38755000438618},{"X":10.397842578156144,"Y":-72.70811514825405},{"X":18.686990351510246,"Y":-77.02868029212195},{"X":26.71180898796669,"Y":-82.06877860300685},{"X":34.39102399910388,"Y":-88.04964823398555},{"X":42.053038544021604,"Y":-94.0689237070068},{"X":49.69339940328325,"Y":-100.13654833640177},{"X":57.3337602625449,"Y":-106.20417296579672},{"X":64.97412112180652,"Y":-112.27179759519169},{"X":72.63792440080618,"Y":-118.27629625691159},{"X":80.92707217416032,"Y":-122.59686140077943},{"X":89.2162199475145,"Y":-126.91742654464733},{"X":97.50536772086863,"Y":-131.2379916885152},{"X":105.7945154942228,"Y":-135.55855683238306}]); 

	this.Unistrokes[4] = new Unistroke("Increase Size", [{"X":-157.67936435905017,"Y":-1.1368683772161603e-13},{"X":-147.27640022566214,"Y":-5.417663397838055},{"X":-136.52288257442387,"Y":-9.111706894411157},{"X":-125.63267486460646,"Y":-11.58498981722903},{"X":-114.69956342665665,"Y":-12.884173104046681},{"X":-103.71151067971908,"Y":-12.679837379997252},{"X":-92.72345793278151,"Y":-12.475501655947824},{"X":-81.73540518584392,"Y":-12.271165931898395},{"X":-70.74812359091209,"Y":-12.563352692370302},{"X":-59.7608559924775,"Y":-12.864551392843794},{"X":-48.77358839404292,"Y":-13.165750093317286},{"X":-37.816668748152836,"Y":-12.493162265071248},{"X":-26.908528767488008,"Y":-10.255362391557185},{"X":-16.00038878682321,"Y":-8.017562518043235},{"X":-5.092248806158381,"Y":-5.779762644529285},{"X":5.733761233288448,"Y":-2.6533453353316077},{"X":16.529381292518792,"Y":0.8018810036787158},{"X":27.32500135174911,"Y":4.257107342689096},{"X":38.19170595126968,"Y":7.001607100179058},{"X":49.06335125991268,"Y":9.696708025087844},{"X":59.93377546325877,"Y":12.404017961827265},{"X":70.72939552248914,"Y":15.859244300837645},{"X":81.52501558171946,"Y":19.31447063984797},{"X":92.32063564094983,"Y":22.769696978858235},{"X":82.78074457945718,"Y":15.424827635311999},{"X":72.60528674643132,"Y":8.462137639621687},{"X":62.68708332612181,"Y":0.4922355155615037},{"X":52.7688799058123,"Y":-7.477666608498566},{"X":43.27224730683548,"Y":-16.76979750505336},{"X":33.851293353997335,"Y":-26.299289429280066},{"X":24.76361216073792,"Y":-36.63342703888503},{"X":16.203241697962028,"Y":-48.240690915016046},{"X":7.784674793699054,"Y":-60.126700998006754},{"X":-0.33458079575964916,"Y":-72.6010735632006},{"X":-8.42975322446469,"Y":-85.11962399740281},{"X":-15.66516573408208,"Y":-98.80552617846547},{"X":-21.276504910886274,"Y":-114.71201033830584},{"X":-16.27196904954377,"Y":-115.58895972656984},{"X":-7.649458954493639,"Y":-104.1129730206714},{"X":0.9730511405564641,"Y":-92.63698631477291},{"X":9.600879890296511,"Y":-81.17254421691223},{"X":18.339540761711987,"Y":-69.9486729922026},{"X":27.07820163312749,"Y":-58.72480176749292},{"X":35.81686250454294,"Y":-47.500930542783294},{"X":44.91803233279052,"Y":-37.18140035665573},{"X":54.29845538825009,"Y":-27.55851544994772},{"X":63.037116259665595,"Y":-16.334644225238037},{"X":72.01679931642218,"Y":-5.691943877244512},{"X":77.40423142907031,"Y":6.377194111621407},{"X":70.368517956157,"Y":20.597386898297998},{"X":61.39875190152054,"Y":31.132406139189868},{"X":52.159308066779204,"Y":41.153577188714166},{"X":42.91986423203787,"Y":51.17474823823835},{"X":33.5021097981309,"Y":60.69714656380279},{"X":23.923296466344993,"Y":69.76902884831912},{"X":14.344483134559084,"Y":78.84091113283546},{"X":4.619514588804691,"Y":87.44437370569352},{"X":-5.247581685174453,"Y":95.59232444516562},{"X":-15.114677959153596,"Y":103.74027518463777},{"X":-24.98177423313271,"Y":111.8882259241098},{"X":-35.45709180364713,"Y":117.36136248580453},{"X":-46.03022318159108,"Y":122.40433693317436},{"X":-56.428427935452305,"Y":128.3877943604956},{"X":-66.81923216680102,"Y":134.4110402734301}]); 

	this.Unistrokes[5] = new Unistroke("Decrease Size", [{"X":-157.31116446949477,"Y":-5.684341886080802e-14},{"X":-144.32945253609003,"Y":-2.5338519865135822},{"X":-131.3477406026853,"Y":-5.067703973027051},{"X":-118.36602866928052,"Y":-7.601555959540576},{"X":-105.38431673587579,"Y":-10.135407946054045},{"X":-92.40260480247102,"Y":-12.66925993256757},{"X":-79.42089286906625,"Y":-15.203111919080982},{"X":-66.46156664229613,"Y":-18.017050516243444},{"X":-53.533719070531305,"Y":-21.224845333006897},{"X":-40.60587149876645,"Y":-24.43264014977018},{"X":-27.64544266452245,"Y":-27.23278308726117},{"X":-14.663730731117681,"Y":-29.766635073774694},{"X":-1.6820187977129137,"Y":-32.30048706028822},{"X":11.255400489864599,"Y":-35.37922869922869},{"X":24.174528978584448,"Y":-38.6829843748331},{"X":37.10917765929679,"Y":-41.795810114724986},{"X":50.09088959270153,"Y":-44.32966210123851},{"X":63.0726015261063,"Y":-46.86351408775198},{"X":76.05431345951106,"Y":-49.39736607426545},{"X":89.03602539291583,"Y":-51.93121806077892},{"X":87.00946098544463,"Y":-41.95691212915676},{"X":77.58197349609443,"Y":-26.8819949388664},{"X":68.15324987914332,"Y":-11.809124472735391},{"X":58.72452626219214,"Y":3.2637459933955597},{"X":49.06586414416765,"Y":17.907543039926964},{"X":39.002812117259424,"Y":31.796734136404893},{"X":28.93976009035117,"Y":45.68592523288277},{"X":18.876708063442948,"Y":59.57511632936064},{"X":8.455233750154662,"Y":72.67210863998156},{"X":-2.33829140039839,"Y":84.94677981500865},{"X":-13.000291645879543,"Y":97.52800034287151},{"X":-23.472573856090776,"Y":110.55140283544665},{"X":-33.96607341531842,"Y":123.52722066290187},{"X":-44.509884877069595,"Y":136.3860910697108},{"X":-52.138445244330455,"Y":148.76735565033732},{"X":-40.82297938879063,"Y":138.20904827455934},{"X":-29.90578126889315,"Y":126.25274530902027},{"X":-19.11225611834007,"Y":113.97807413399335},{"X":-8.240420407788804,"Y":101.89825323219304},{"X":2.6897968142672823,"Y":89.9637942298994},{"X":12.80363743539371,"Y":76.17726746049624},{"X":22.91747805652014,"Y":62.39074069109307},{"X":33.21079183940171,"Y":48.99123677472977},{"X":43.779298348763575,"Y":36.18516907521695},{"X":53.01469729688651,"Y":20.884602064396518},{"X":61.94678690711967,"Y":4.998886026757191},{"X":71.21439906611405,"Y":-10.348531995760936},{"X":79.48335121964541,"Y":-27.109817461162493},{"X":87.50199755097495,"Y":-44.242282131601826},{"X":92.68883553050526,"Y":-60.91900792720543},{"X":79.69108083419005,"Y":-60.706015393049825},{"X":66.63993809687142,"Y":-59.75803719661894},{"X":53.57137546872352,"Y":-60.14181581275267},{"X":40.5028128405757,"Y":-60.52559442888645},{"X":27.434250212427855,"Y":-60.90937304502023},{"X":14.452876740106888,"Y":-63.397012316012194},{"X":1.4765303948458097,"Y":-66.00595537447543},{"X":-11.458381671690205,"Y":-69.06470936218352},{"X":-24.3077831922553,"Y":-73.05176666123117},{"X":-37.157184712820396,"Y":-77.03882396027876},{"X":-49.55811220149198,"Y":-83.63510741405219},{"X":-61.704398002117216,"Y":-91.67061864569183},{"X":-73.41683950310383,"Y":-101.23264434966268},{"X":-73.35821354427662,"Y":-87.56757955423006}]); 

	this.Unistrokes[6] = new Unistroke("Make Slow", [{"X":-140.17774933930303,"Y":-1.1368683772161603e-13},{"X":-137.38527447450417,"Y":9.948191030322562},{"X":-134.59279960970537,"Y":19.89638206064518},{"X":-131.8003247449065,"Y":29.8445730909678},{"X":-129.79745453328763,"Y":39.96445518002571},{"X":-128.13062101830093,"Y":50.1574048428198},{"X":-125.52429324791211,"Y":60.14607156131245},{"X":-122.73181838311325,"Y":70.09426259163507},{"X":-119.93934351831444,"Y":80.04245362195769},{"X":-117.14686865351564,"Y":89.99064465228031},{"X":-114.35439378871683,"Y":99.93883568260298},{"X":-110.04324185632225,"Y":108.83807386309434},{"X":-101.59171261955618,"Y":114.87754635312683},{"X":-91.31513219401779,"Y":114.2953600574682},{"X":-80.93906593136091,"Y":113.35221880807444},{"X":-70.64407893843537,"Y":111.822182650321},{"X":-60.39403165879048,"Y":109.96684892889914},{"X":-50.221490668613114,"Y":107.77743879865795},{"X":-40.18303632478438,"Y":105.01007318131349},{"X":-30.144581980955536,"Y":102.24270756396913},{"X":-22.522833798543672,"Y":95.39611292364373},{"X":-15.192470171794241,"Y":88.05768176827814},{"X":-7.86210654504481,"Y":80.71925061291267},{"X":-2.725787368194574,"Y":72.0180268937429},{"X":0.7432036471114429,"Y":62.2811712756486},{"X":4.21219466241746,"Y":52.54431565755431},{"X":7.6811856777235334,"Y":42.80746003946007},{"X":11.150176693029493,"Y":33.070604421365715},{"X":13.426114577431179,"Y":23.05772771450563},{"X":14.66611376587747,"Y":12.80517942945238},{"X":15.906112954323817,"Y":2.552631144399072},{"X":17.146112142770107,"Y":-7.699917140654122},{"X":17.336958256684397,"Y":-18.00613817770642},{"X":17.168837034663852,"Y":-28.33072332697941},{"X":17.000715812643307,"Y":-38.6553084762524},{"X":16.83259459062276,"Y":-48.97989362552539},{"X":16.664473368602216,"Y":-59.30447877479838},{"X":17.685864763297957,"Y":-69.56821063466435},{"X":18.925863951744304,"Y":-79.82075891971766},{"X":20.16586314019071,"Y":-90.07330720477086},{"X":21.446889968028245,"Y":-100.31946872025742},{"X":23.438557779134157,"Y":-110.455004806835},{"X":25.43022559024007,"Y":-120.59054089341265},{"X":32.138562406023254,"Y":-127.82379749812765},{"X":41.16334712307662,"Y":-132.8735990805484},{"X":50.95874755954611,"Y":-135.12245364687317},{"X":60.06828276345448,"Y":-131.9499933426153},{"X":65.891895019326,"Y":-123.3874285132569},{"X":71.55952549467008,"Y":-114.72680097687129},{"X":76.89489628105451,"Y":-105.85728824616814},{"X":82.23026706743894,"Y":-96.98777551546505},{"X":85.70323918570858,"Y":-87.25914552687686},{"X":89.1164575024847,"Y":-77.50295134219772},{"X":92.52967581926094,"Y":-67.74675715751857},{"X":95.53075287371615,"Y":-57.86308708554162},{"X":98.32322773851496,"Y":-47.91489605521895},{"X":101.11570260331376,"Y":-37.96670502489633},{"X":103.90817746811268,"Y":-28.01851399457371},{"X":106.70065233291149,"Y":-18.07032296425109},{"X":109.27391932838992,"Y":-8.086632081913194},{"X":109.82225066069697,"Y":2.2249891644479476},{"X":109.51612468198988,"Y":12.40016097911689},{"X":105.50521515386373,"Y":21.914802939168567},{"X":100.38153392790304,"Y":30.90605927129559}]); 

	//this.Unistrokes[7] = new Unistroke("Make Fast", [{"X":-111.11515959472445,"Y":-2.2737367544323206e-13},{"X":-114.246721749443,"Y":6.484405861381049},{"X":-116.89634118464699,"Y":13.269949883572224},{"X":-119.54596061985092,"Y":20.055493905763342},{"X":-119.49868502166453,"Y":27.35953512446366},{"X":-119.16339475885349,"Y":34.71894920503394},{"X":-118.65153289574869,"Y":42.060187567512855},{"X":-117.70296112927701,"Y":49.356472403614816},{"X":-115.609383590464,"Y":56.168731730660625},{"X":-111.75081084014727,"Y":62.234878918915285},{"X":-107.66485874108889,"Y":68.10090968553129},{"X":-102.98072529124784,"Y":73.44048142201939},{"X":-98.11876718816632,"Y":78.56377327128439},{"X":-92.68856951244999,"Y":82.9959416545637},{"X":-87.2583718367336,"Y":87.42811003784288},{"X":-81.82817416101727,"Y":91.86027842112219},{"X":-75.66057264212355,"Y":94.26281034489807},{"X":-68.90059023350659,"Y":95.03486819016274},{"X":-62.15811673044584,"Y":94.72352734782663},{"X":-55.42722929755257,"Y":93.69527515007945},{"X":-49.04064631500967,"Y":91.33470604042344},{"X":-42.79651537733224,"Y":88.42290598293334},{"X":-36.560286067290576,"Y":85.49733700932046},{"X":-31.390960495903528,"Y":80.71264371784156},{"X":-26.22163492451648,"Y":75.92795042636254},{"X":-21.052309353129317,"Y":71.14325713488364},{"X":-16.475128358671725,"Y":65.70253242491555},{"X":-11.949583777063935,"Y":60.204600217847315},{"X":-7.424039195456146,"Y":54.70666801077908},{"X":-2.8984946138482997,"Y":49.20873580371091},{"X":1.2395172437305177,"Y":43.366231520303074},{"X":5.328231862418477,"Y":37.47989493342965},{"X":9.416946481106379,"Y":31.593558346556335},{"X":13.505661099794338,"Y":25.707221759683023},{"X":17.59437571848224,"Y":19.82088517280971},{"X":21.6830903371702,"Y":13.934548585936398},{"X":25.77180495585816,"Y":8.048211999063085},{"X":29.86051957454606,"Y":2.1618754121897723},{"X":33.94923419323402,"Y":-3.724461174683597},{"X":38.03794881192198,"Y":-9.61079776155691},{"X":42.12666343060988,"Y":-15.497134348430222},{"X":46.2153780492979,"Y":-21.383470935303535},{"X":50.30409266798574,"Y":-27.269807522176848},{"X":54.11730197171312,"Y":-33.35851836094014},{"X":57.64540021370988,"Y":-39.65665941643647},{"X":61.173498455706635,"Y":-45.95480047193274},{"X":64.69353834067931,"Y":-52.25818042268645},{"X":68.1575802796981,"Y":-58.5979657315803},{"X":71.62162221871688,"Y":-64.93775104047404},{"X":75.05549182465472,"Y":-71.29572352528629},{"X":78.19585608205648,"Y":-77.83061416198689},{"X":81.38946395589403,"Y":-84.32909276735762},{"X":85.47817857458199,"Y":-90.21542935423093},{"X":89.56689319326995,"Y":-96.10176594110425},{"X":93.6556078119579,"Y":-101.98810252797756},{"X":97.74432243064587,"Y":-107.87443911485087},{"X":101.83303704933371,"Y":-113.76077570172424},{"X":105.92175166802167,"Y":-119.64711228859755},{"X":110.01046628670963,"Y":-125.53344887547087},{"X":114.09918090539759,"Y":-131.41978546234418},{"X":118.18789552408555,"Y":-137.30612204921755},{"X":122.2766101427734,"Y":-143.19245863609086},{"X":126.36532476146135,"Y":-149.07879522296417},{"X":130.45403938014908,"Y":-154.96513180983723}]); 

	this.Unistrokes[7] = new Unistroke("Make Fast", [{"X":-135.8081431659939,"Y":-1.1368683772161603e-13},{"X":-131.06633917616983,"Y":4.53851396518786},{"X":-126.29274950016988,"Y":9.004964980587488},{"X":-121.21846322441765,"Y":12.789691403052757},{"X":-116.07519477670003,"Y":16.35419558516054},{"X":-110.61656986958813,"Y":18.911939556328605},{"X":-105.35064078311268,"Y":22.112137156594372},{"X":-100.19356839762912,"Y":25.675266253624613},{"X":-95.03649601214553,"Y":29.238395350654912},{"X":-89.86175146134502,"Y":32.751685530767645},{"X":-84.67734556197544,"Y":36.237728843277864},{"X":-79.49293966260586,"Y":39.723772155788026},{"X":-74.6906658796672,"Y":44.1184939654201},{"X":-69.94886188984319,"Y":48.65700793060802},{"X":-65.20705790001918,"Y":53.19552189579599},{"X":-60.46525391019517,"Y":57.73403586098391},{"X":-55.723449920371166,"Y":62.272549826171826},{"X":-50.98164593054716,"Y":66.81106379135974},{"X":-46.23984194072315,"Y":71.34957775654772},{"X":-41.498037950899146,"Y":75.88809172173563},{"X":-36.75623396107517,"Y":80.42660568692355},{"X":-32.10969614404132,"Y":85.12101749493002},{"X":-28.064625631656156,"Y":90.79969740749397},{"X":-23.32282164183215,"Y":95.33821137268188},{"X":-18.445453065305202,"Y":99.0013345394675},{"X":-14.806199332575972,"Y":93.21154741503193},{"X":-11.108288006544115,"Y":87.11969551990637},{"X":-7.313398182575725,"Y":81.13809149659261},{"X":-4.040017562890597,"Y":74.56362120780898},{"X":-0.7666369432054978,"Y":67.98915091902523},{"X":2.5067436764796014,"Y":61.41468063024155},{"X":5.780124296164729,"Y":54.84021034145786},{"X":9.053504915849828,"Y":48.265740052674175},{"X":12.326885535534927,"Y":41.69126976389049},{"X":15.600266155220055,"Y":35.1167994751068},{"X":18.873646774905154,"Y":28.542329186323116},{"X":22.147027394590253,"Y":21.96785889753943},{"X":25.42040801427538,"Y":15.393388608755743},{"X":28.69378863396048,"Y":8.818918319972056},{"X":31.96716925364558,"Y":2.2444480311883694},{"X":35.24054987333068,"Y":-4.330022257595317},{"X":38.513930493015835,"Y":-10.904492546378975},{"X":41.787311112700934,"Y":-17.478962835162662},{"X":45.06069173238603,"Y":-24.05343312394635},{"X":48.33407235207113,"Y":-30.627903412730035},{"X":51.60745297175623,"Y":-37.20237370151372},{"X":54.88083359144133,"Y":-43.77684399029741},{"X":58.15421421112643,"Y":-50.351314279081095},{"X":61.427594830811586,"Y":-56.92578456786478},{"X":64.70097545049668,"Y":-63.50025485664847},{"X":67.97435607018178,"Y":-70.07472514543215},{"X":71.24773668986688,"Y":-76.64919543421581},{"X":74.52111730955198,"Y":-83.2236657229995},{"X":77.79449792923708,"Y":-89.79813601178319},{"X":81.06787854892218,"Y":-96.37260630056687},{"X":84.57037595179833,"Y":-102.69272818701015},{"X":88.48144979006833,"Y":-108.55927892022308},{"X":91.84216062935508,"Y":-115.03680169812452},{"X":95.11554124904023,"Y":-121.6112719869082},{"X":99.21947811949065,"Y":-127.21007440836883},{"X":102.59708204957076,"Y":-133.66211188795413},{"X":106.39904209486798,"Y":-139.61565137232492},{"X":110.07862285010128,"Y":-145.7129517890001},{"X":114.19185683400616,"Y":-150.99866546053244}]);
	
	this.Unistrokes[8] = new Unistroke("Fast Forward", [{"X":-168.2023168665375,"Y":1.7053025658242404e-13},{"X":-162.20297995853946,"Y":6.147519331587546},{"X":-156.20364305054147,"Y":12.295038663174807},{"X":-148.0925817190406,"Y":11.999395590909444},{"X":-139.77487818959668,"Y":11.073258678625166},{"X":-131.70224331977408,"Y":8.824064789984448},{"X":-123.66581202028374,"Y":6.379417976554862},{"X":-115.68380413414076,"Y":3.746079602242844},{"X":-107.71843136050393,"Y":1.0550655852029536},{"X":-99.75305858686704,"Y":-1.6359484318369368},{"X":-91.78768581323021,"Y":-4.32696244887677},{"X":-83.88869542648393,"Y":-7.212332503293965},{"X":-76.12664481075097,"Y":-10.498638295339617},{"X":-68.36459419501807,"Y":-13.784944087385156},{"X":-60.60254357928517,"Y":-17.07124987943081},{"X":-52.84049296355232,"Y":-20.35755567147652},{"X":-45.073712254623274,"Y":-23.63127700945131},{"X":-37.28575695510267,"Y":-26.84866316506924},{"X":-29.497801655581952,"Y":-30.066049320687284},{"X":-21.709846356061234,"Y":-33.283435476305385},{"X":-13.92189105654063,"Y":-36.50082163192337},{"X":-6.133935757019913,"Y":-39.71820778754136},{"X":1.654019542500805,"Y":-42.935593943159404},{"X":9.126300672500633,"Y":-46.88734670331149},{"X":16.552171455876532,"Y":-50.947065879332285},{"X":23.97804223925243,"Y":-55.00678505535319},{"X":31.40391302262833,"Y":-59.06650423137404},{"X":38.480348238916804,"Y":-63.75034450768288},{"X":45.43579739880397,"Y":-68.65027598292193},{"X":52.39124655869102,"Y":-73.55020745816103},{"X":59.345400176444514,"Y":-78.45203948567502},{"X":65.96303856346003,"Y":-83.84753726949879},{"X":72.45644325287435,"Y":-89.38978143456887},{"X":78.52594002313845,"Y":-94.70416308645156},{"X":81.79768313346244,"Y":-88.80954411304594},{"X":80.8807517081242,"Y":-80.03992244909523},{"X":79.96382028278572,"Y":-71.27030078514446},{"X":78.15783321327729,"Y":-62.69914827056749},{"X":75.62829681249264,"Y":-54.28951795232308},{"X":73.0987604117081,"Y":-45.87988763407884},{"X":70.56922401092368,"Y":-37.47025731583443},{"X":68.03968761013914,"Y":-29.060626997590077},{"X":65.51015120935449,"Y":-20.650996679345724},{"X":62.98061480857007,"Y":-12.241366361101427},{"X":60.45107840778553,"Y":-3.8317360428570737},{"X":57.921542007000994,"Y":4.57789427538728},{"X":55.3672661713598,"Y":12.979029403471884},{"X":52.719036203951305,"Y":21.347901942686804},{"X":50.07080623654292,"Y":29.716774481901723},{"X":47.42257626913454,"Y":38.08564702111653},{"X":44.77434630172638,"Y":46.45451956033139},{"X":42.126116334318,"Y":54.82339209954631},{"X":39.477886366909615,"Y":63.19226463876117},{"X":36.82965639950123,"Y":71.56113717797592},{"X":33.97672156887154,"Y":79.84964691908147},{"X":30.793865068253922,"Y":88.00863639310643},{"X":27.611008567636418,"Y":96.16762586713133},{"X":25.055173047355424,"Y":104.5465875036486},{"X":22.971751036623232,"Y":113.09128174648191},{"X":20.888329025891153,"Y":121.63597598931523},{"X":18.80490701515896,"Y":130.18067023214854},{"X":16.326204481728155,"Y":138.58669174456946},{"X":13.14334798111065,"Y":146.74568121859437},{"X":11.56224719228669,"Y":155.29583691354838}]); 

	this.Unistrokes[9] = new Unistroke("Rewind", [{"X":-175.72339855865044,"Y":-5.684341886080802e-14},{"X":-168.4623025788434,"Y":3.500740945558789},{"X":-160.28580351780886,"Y":4.645097465503056},{"X":-151.95026834276808,"Y":4.6565503154282055},{"X":-143.62638988242298,"Y":4.78909578674012},{"X":-135.45014830256895,"Y":6.455326978154858},{"X":-127.2739067227149,"Y":8.121558169569653},{"X":-119.09766514286088,"Y":9.787789360984448},{"X":-110.95352386234643,"Y":11.610348627288829},{"X":-102.81890055685125,"Y":13.479260318406205},{"X":-94.68427725135604,"Y":15.348172009523523},{"X":-86.54965394586085,"Y":17.2170837006409},{"X":-78.4150306403657,"Y":19.085995391758274},{"X":-70.28040733487049,"Y":20.95490708287565},{"X":-62.14578402937528,"Y":22.82381877399297},{"X":-54.36830674827317,"Y":25.90015900756481},{"X":-46.59695270482521,"Y":28.997200498916186},{"X":-38.82559866137723,"Y":32.09424199026756},{"X":-31.05424461792927,"Y":35.191283481618996},{"X":-23.266542557911862,"Y":38.24399720302233},{"X":-15.448804315353868,"Y":41.2152675894427},{"X":-7.631066072795903,"Y":44.18653797586302},{"X":0.18667216976211876,"Y":47.15780836228339},{"X":8.004410412320084,"Y":50.12907874870376},{"X":15.57629461333579,"Y":53.631233635308206},{"X":22.7520191709728,"Y":57.98883516394841},{"X":29.927743728609812,"Y":62.3464366925885},{"X":37.09167064969546,"Y":66.72421339736377},{"X":44.20607655248193,"Y":71.18667615448811},{"X":51.32048245526835,"Y":75.64913891161245},{"X":58.0768306959867,"Y":80.63138088618672},{"X":64.53912659678826,"Y":86.04048789207621},{"X":70.22937947326687,"Y":92.21052771389668},{"X":74.27660144134956,"Y":88.6039027669745},{"X":73.32766702364609,"Y":80.09584959878697},{"X":72.3787326059425,"Y":71.58779643059944},{"X":71.42979818823903,"Y":63.07974326241185},{"X":70.32671423174935,"Y":54.59152201632685},{"X":69.20429212499204,"Y":46.10578869652903},{"X":68.08187001823472,"Y":37.62005537673116},{"X":66.95944791147753,"Y":29.134322056933343},{"X":65.83702580472021,"Y":20.64858873713547},{"X":64.71460369796296,"Y":12.162855417337653},{"X":63.592181591205645,"Y":3.6771220975398364},{"X":62.35955631078514,"Y":-4.790712474312386},{"X":60.87941831874076,"Y":-13.218347045643384},{"X":59.3992803266965,"Y":-21.64598161697444},{"X":57.91914233465218,"Y":-30.073616188305493},{"X":56.43900434260786,"Y":-38.50125075963655},{"X":54.95886635056354,"Y":-46.928885330967546},{"X":53.47872835851922,"Y":-55.3565199022986},{"X":51.74769943410223,"Y":-63.71324948011147},{"X":48.82402528425456,"Y":-71.7329222293697},{"X":45.90035113440689,"Y":-79.75259497862783},{"X":42.976676984559276,"Y":-87.772267727886},{"X":40.05300283471166,"Y":-95.79194047714418},{"X":37.12932868486405,"Y":-103.81161322640241},{"X":34.19418440172086,"Y":-111.82660958899146},{"X":30.969795727290546,"Y":-119.72368067724517},{"X":27.745407052860173,"Y":-127.62075176549894},{"X":24.51917202667488,"Y":-135.51690952781547},{"X":20.52094930988426,"Y":-143.0311918543133},{"X":16.88922710230696,"Y":-150.7092795512403},{"X":15.965518869923358,"Y":-157.78947228610332}]); 

	


	//
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		points = Resample(points, NumPoints);
		var radians = IndicativeAngle(points);
		points = RotateBy(points, -radians);
		points = ScaleTo(points, SquareSize);
		points = TranslateTo(points, Origin);
		var vector = Vectorize(points); // for Protractor

		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke
		{
			var d;
			if (useProtractor) // for Protractor
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, vector);
			else // Golden Section Search (original $1)
				d = DistanceAtBestAngle(points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : new Result(this.Unistrokes[u].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
	};
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from this point down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i - 1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
			var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }
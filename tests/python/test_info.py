# tests/test_info.py
#import sys, os
#curr_dir = os.path.dirname(__file__)
#rel_path = os.path.join(curr_dir, '../src')
#sys.path.insert(0, os.path.abspath(rel_path))

import unittest
from remah.info import ramah

class TestInfo(unittest.TestCase):
    
    def test_ramah(self):
        result = ramah()
        expected_result = 'Hello, I am remah ramah!'
        self.assertEqual(result, expected_result)

if __name__ == '__main__':
    unittest.main()

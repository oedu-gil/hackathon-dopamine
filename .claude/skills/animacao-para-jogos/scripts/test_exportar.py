import json
from pathlib import Path
import tempfile
import unittest
from PIL import Image
from exportar import export


class ExportTests(unittest.TestCase):
    def setUp(self):
        self.test_root = Path.cwd() / '.animation-skill-qa'
        self.test_root.mkdir(parents=True, exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=self.test_root)
        self.addCleanup(self.cleanup)
        self.root = Path(self.temp.name)
        self.frames = self.root / 'input'
        self.frames.mkdir()
        for i in range(3):
            Image.new('RGBA', (12, 18), (i*60, 90, 120, 100+i)).save(self.frames / f'{i}.png')
        self.selection = {'loop': True, 'events': [{'name': 'contact', 'frame_index': 1}],
                          'frames': [{'file': f'{i}.png', 'source_timestamp_ms': i*100, 'duration_ms': 50+i*10} for i in range(3)]}

    def cleanup(self):
        assert Path(self.temp.name).resolve().is_relative_to(self.test_root.resolve())
        self.temp.cleanup()

    def test_native_pixels_alpha_and_playback_event(self):
        before = [(self.frames / f'{i}.png').read_bytes() for i in range(3)]
        data = export(self.frames, self.selection, self.root/'out', 2)
        self.assertEqual(data['duration_ms'], 180)
        self.assertEqual(data['events'][0]['time_ms'], 50)
        with Image.open(self.root/'out/spritesheet.png') as sheet:
            self.assertEqual(sheet.size, (24,36))
            self.assertEqual(sheet.getpixel((12,0)), (60,90,120,101))
            self.assertEqual(sheet.getpixel((0,18)), (120,90,120,102))
        self.assertEqual(before, [(self.frames/f'{i}.png').read_bytes() for i in range(3)])
        with self.assertRaises(ValueError): export(self.frames, self.selection, self.root/'out')

    def test_invalid_times_and_paths_leave_no_output(self):
        for change in ({'duration_ms': 0}, {'duration_ms': float('nan')}, {'file': '../outside.png'}):
            selection = json.loads(json.dumps(self.selection))
            selection['frames'][0].update(change)
            with self.assertRaises(ValueError): export(self.frames, selection, self.root/'bad')
            self.assertFalse((self.root/'bad').exists())

    def test_mismatched_canvas_and_out_of_range_event(self):
        self.selection['events'][0]['frame_index'] = 9
        with self.assertRaises(ValueError): export(self.frames, self.selection, self.root/'bad')
        self.selection['events'] = []
        Image.new('RGBA',(10,10)).save(self.frames/'2.png')
        with self.assertRaises(ValueError): export(self.frames, self.selection, self.root/'bad')
        self.assertFalse((self.root/'bad').exists())


if __name__ == '__main__':
    unittest.main()

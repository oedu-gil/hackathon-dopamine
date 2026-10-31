"""Export an explicit frame selection without resizing, keying or alignment."""
import argparse
import json
import math
from pathlib import Path
from PIL import Image


def export(frames_dir, selection, output, columns=4):
    frames_dir, output = Path(frames_dir).resolve(), Path(output)
    if output.exists():
        raise ValueError('A pasta de saída já existe; usar nova variante.')
    if not isinstance(columns, int) or columns < 1:
        raise ValueError('Colunas devem ser positivas.')
    records = selection.get('frames', [])
    if not records:
        raise ValueError('Seleção vazia.')
    frames, previous = [], -1
    for record in records:
        path = (frames_dir / record['file']).resolve()
        if not path.is_relative_to(frames_dir):
            raise ValueError('Frame fora da pasta de entrada.')
        timestamp, duration = record['source_timestamp_ms'], record['duration_ms']
        if not all(isinstance(v, (int, float)) and math.isfinite(v) for v in (timestamp, duration)):
            raise ValueError('Tempos devem ser números finitos.')
        if duration <= 0 or timestamp < 0 or timestamp <= previous:
            raise ValueError('Durações positivas e timestamps em ordem estrita são necessários.')
        previous = timestamp
        with Image.open(path) as source:
            frames.append(source.convert('RGBA'))
    size = frames[0].size
    if any(frame.size != size for frame in frames):
        raise ValueError('Todos os quadros precisam de um canvas comum; não redimensionar individualmente.')
    for event in selection.get('events', []):
        index = event['frame_index']
        if not isinstance(index, int) or not 0 <= index < len(frames):
            raise ValueError('Evento fora da sequência.')
    columns = min(columns, len(frames))
    rows = math.ceil(len(frames) / columns)
    sheet = Image.new('RGBA', (size[0]*columns, size[1]*rows))
    output.mkdir(parents=True)
    (output / 'frames').mkdir()
    for i, frame in enumerate(frames):
        sheet.paste(frame, ((i % columns)*size[0], (i // columns)*size[1]))
        frame.save(output / 'frames' / f'{i:03d}.png')
    sheet.save(output / 'spritesheet.png')
    data = dict(selection)
    data.update(frame_width=size[0], frame_height=size[1], columns=columns, rows=rows,
                frame_count=len(frames), duration_ms=sum(r['duration_ms'] for r in records),
                max_hold_ms=max(r['duration_ms'] for r in records),
                processing={'resize': False, 'alignment': False, 'background_removal': False})
    for event in data.get('events', []):
        event['time_ms'] = sum(r['duration_ms'] for r in records[:event['frame_index']])
    (output / 'animation.json').write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    return data


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--frames', required=True)
    parser.add_argument('--selection', required=True)
    parser.add_argument('--out', required=True)
    parser.add_argument('--columns', type=int, default=4)
    args = parser.parse_args()
    data = export(args.frames, json.loads(Path(args.selection).read_text(encoding='utf-8-sig')), args.out, args.columns)
    print(json.dumps({key: data[key] for key in ('frame_count', 'duration_ms', 'max_hold_ms')}))

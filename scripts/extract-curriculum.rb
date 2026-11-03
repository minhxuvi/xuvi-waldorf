#!/usr/bin/env ruby
# Rebuild structured source records without editing the original references.
require 'yaml'
require 'json'
require 'date'
require 'digest'
require 'fileutils'

root = File.expand_path('..', __dir__)
records = []
Dir[File.join(root, 'references', '0*.md')].sort.each do |file|
  text = File.read(file)
  text.to_enum(:scan, /```yaml\s*\n(.*?)\n```/m).each do
    match = Regexp.last_match
    data = YAML.safe_load(match[1], permitted_classes: [Date], aliases: true)
    next unless data.is_a?(Hash)
    records << {
      'sourceFile' => File.basename(file),
      'sourceLine' => text[0...match.begin(0)].count("\n") + 1,
      'sourceSha256' => Digest::SHA256.file(file).hexdigest,
      'data' => data
    }
  end
end
out = File.join(root, 'server', 'assets', 'curriculum-source.json')
FileUtils.mkdir_p(File.dirname(out))
File.write(out, JSON.pretty_generate(records) + "\n")
puts "Extracted #{records.length} complete curriculum records to #{out}"

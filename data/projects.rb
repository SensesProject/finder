#!/usr/bin/env ruby
# encoding: utf-8
Dir.chdir(File.dirname(__FILE__))

require "json"
require "csv"
require "awesome_print"

files = Dir["projects/*.csv"]

def readCSV (file)
  CSV.read("#{file}", { encoding: "UTF-8", headers: true }).map { |d| d.to_hash }
end

def writeJSON (file, obj)
	File.open("#{file}", 'w') do |f|
	  f.write(JSON.pretty_generate(obj))
	end
end

def buildDataStructure (arr)
	attributes = ['factsheet', 'topic', 'attribute', 'subattribute']
	temp = Array.new(attributes.length)

	arr.each do |row|
		attributes.each_with_index do |attribute, i|
			if row[attribute].nil?
				row[attribute] = temp[i]
			else
				temp[i] = row[attribute]
			end
		end
	end

	arr
end

def get (arr, obj)
	keys = obj.keys
	arr.select do |e|
		keys.all? { |key| e[key].eql? obj[key] }
	end
end

def extractData (arr, path, key)
	datum = get(arr, path)
	ap path
	if datum.length > 1
		datum.map { |e| e[key] }
	elsif datum.length.eql? 0
		nil
	else
		datum[0][key]
	end
end

def buildData (arr, data)
	item = {}
	arr.each do |el|
		item[el['label']] = extractData(data, el['path'], el['key'])
	end
	item
end

structure = [{
	'label' => 'title',
	'path' => { 'topic' => 'project', 'attribute' => nil },
	'key' => 'factsheet'
}, {
	'label' => 'guiding questions preamble',
	'path' => { 'topic' => 'guiding questions', 'attribute' => 'preamble' },
	'key' => 'value'
}, {
	'label' => 'guiding questions questions',
	'path' => { 'topic' => 'guiding questions', 'attribute' => 'question' },
	'key' => 'value'
}, {
	'label' => 'results preamble',
	'path' => { 'topic' => 'results', 'attribute' => 'preamble' },
	'key' => 'value'
}, {
	'label' => 'results',
	'path' => { 'topic' => 'results', 'attribute' => 'insight' },
	'key' => 'value'
}, {
	'label' => 'scenarios',
	'path' => { 'topic' => 'scenarios', 'attribute' => 'preamble' },
	'key' => 'value'
}, {
	'label' => 'start',
	'path' => { 'topic' => 'time horizon', 'attribute' => 'start' },
	'key' => 'value'
}, {
	'label' => 'end',
	'path' => { 'topic' => 'time horizon', 'attribute' => 'end' },
	'key' => 'value'
}]


items = files.map do |file|
	raw = readCSV(file)
	data = buildDataStructure(raw)
	buildData(structure, data)
end

writeJSON('projects.json', items)